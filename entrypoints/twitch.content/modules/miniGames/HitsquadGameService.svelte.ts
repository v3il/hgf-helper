import { Container } from 'typedi';
import { log, wait } from '@utils';
import { Timing } from '@shared/consts';
import { MessageSender } from '@twitch/modules/twitchChat';
import { StreamStatusService } from '@twitch/modules/stream';
import { SettingsFacade } from '@shared/modules';
import { random } from 'lodash';
import { TwitchUIService } from '@twitch/modules';

const HITSQUAD_GAMES_ON_SCREEN = 12;
const COMMAND = '!hitsquad';

export class HitsquadGameService {
    static readonly HITSQUAD_GAMES_PER_DAY = 600;

    private readonly messageSender: MessageSender;
    private readonly streamStatusService: StreamStatusService;
    private readonly settingsFacade: SettingsFacade;
    private readonly twitchUIService: TwitchUIService;

    isRunning = $state(false);
    remainingRounds = $state(0);
    totalRounds = $state(0);
    timeUntilMessage = $state(0);

    private timeout!: number;

    constructor() {
        this.settingsFacade = Container.get(SettingsFacade);
        this.messageSender = Container.get(MessageSender);
        this.streamStatusService = Container.get(StreamStatusService);
        this.twitchUIService = Container.get(TwitchUIService);

        this.isRunning = this.settingsFacade.settings.hitsquad;
        this.remainingRounds = this.settingsFacade.settings.hitsquadRounds;

        if (this.isRunning) {
            this.start();
        }
    }

    start(rounds?: number) {
        if (rounds) {
            this.isRunning = true;
            this.remainingRounds = rounds;
            this.saveState();
        }

        log(`Start Hitsquad service with ${this.remainingRounds} rounds`);

        this.totalRounds = this.remainingRounds;

        this.scheduleNextRound();
    }

    stop() {
        this.isRunning = false;
        this.remainingRounds = 0;

        this.saveState();

        clearTimeout(this.timeout);
    }

    participate() {
        this.messageSender.sendMessage(COMMAND);
    }

    destroy() {
        this.isRunning = false;
        this.remainingRounds = 0;

        clearTimeout(this.timeout);
    }

    private saveState() {
        this.settingsFacade.updateSettings({
            hitsquad: this.isRunning,
            hitsquadRounds: this.remainingRounds
        });
    }

    private async sendCommand(): Promise<void> {
        if (!this.streamStatusService.isMiniGamesAllowed) {
            const delay = 20 * Timing.SECOND;

            this.timeUntilMessage = Date.now() + delay;
            await wait(delay);
            return this.sendCommand();
        }

        this.participate();
        this.remainingRounds -= HITSQUAD_GAMES_ON_SCREEN;
        this.saveState();
    }

    private getNextRoundDelay() {
        return this.twitchUIService.isHitsquadChannel
            ? random(30 * Timing.SECOND, 5 * Timing.MINUTE) + 8 * Timing.MINUTE
            : random(30 * Timing.SECOND, 10 * Timing.MINUTE) + 28 * Timing.MINUTE;
    }

    private scheduleNextRound() {
        const delay = this.getNextRoundDelay();

        this.timeUntilMessage = Date.now() + delay;

        this.timeout = window.setTimeout(async () => {
            if (!this.streamStatusService.isBotWorking) {
                log('Bot is not working, scheduling next round');
                return this.scheduleNextRound();
            }

            await this.sendCommand();

            if (this.remainingRounds > 0) {
                return this.scheduleNextRound();
            }

            this.stop();
        }, delay);
    }
}
