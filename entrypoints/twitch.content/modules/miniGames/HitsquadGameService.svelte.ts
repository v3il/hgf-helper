import { Container } from 'typedi';
import { log, wait } from '@utils';
import { Timing } from '@shared/consts';
import { MessageSender } from '@twitch/modules/twitchChat';
import { StreamStatusService } from '@twitch/modules/stream';
import { random } from 'lodash';
import { config } from '@twitch/config';
import { LocalSettingsService } from '@shared/services';
import { ITwitchLocalSettings } from '@twitch/modules';

interface IHitsquadGameServiceParams {
    localSettingsService: LocalSettingsService<ITwitchLocalSettings>;
}

export class HitsquadGameService {
    readonly command = '!hitsquad';
    static readonly HITSQUAD_GAMES_PER_DAY = 600;
    static readonly HITSQUAD_GAMES_ON_SCREEN = 12;

    private readonly messageSender: MessageSender;
    private readonly streamStatusService: StreamStatusService;
    private readonly localSettingsService: LocalSettingsService<ITwitchLocalSettings>;

    isRunning = $state(false);
    remainingRounds = $state(0);
    totalRounds = $state(0);
    timeUntilMessage = $state(0);

    private timeout!: number;

    constructor({ localSettingsService }: IHitsquadGameServiceParams) {
        this.localSettingsService = localSettingsService;
        this.messageSender = Container.get(MessageSender);
        this.streamStatusService = Container.get(StreamStatusService);

        this.isRunning = localSettingsService.settings.hitsquad;
        this.remainingRounds = localSettingsService.settings.hitsquadRounds;

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
        this.messageSender.sendMessage(this.command);
    }

    destroy() {
        this.isRunning = false;
        this.remainingRounds = 0;

        clearTimeout(this.timeout);
    }

    private saveState() {
        this.localSettingsService.updateSettings({
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
        this.remainingRounds -= HitsquadGameService.HITSQUAD_GAMES_ON_SCREEN;
        this.saveState();
    }

    private getNextRoundDelay() {
        return 5000;

        return random(30 * Timing.SECOND, 5 * Timing.MINUTE) + config.hitsquadGameBaseTimeout;
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
