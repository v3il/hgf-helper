import { Container } from 'typedi';
import { wait } from '@utils';
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

    remainingRounds = $state(0);
    totalRounds = $state(0);
    timeUntilMessage = $state(0);
    isGameRunning = $derived(this.remainingRounds > 0);

    private timeout!: number;

    constructor({ localSettingsService }: IHitsquadGameServiceParams) {
        this.localSettingsService = localSettingsService;
        this.messageSender = Container.get(MessageSender);
        this.streamStatusService = Container.get(StreamStatusService);
    }

    init() {
        this.remainingRounds = this.localSettingsService.settings.hitsquadRounds;

        if (this.isGameRunning) {
            this.start(this.remainingRounds);
        }
    }

    start(rounds: number) {
        this.remainingRounds = rounds;
        this.totalRounds = rounds;

        this.saveState();
        this.scheduleRound();
    }

    stop() {
        this.remainingRounds = 0;
        this.saveState();

        clearTimeout(this.timeout);
    }

    sendCommand() {
        this.messageSender.sendMessage(this.command);
    }

    destroy() {
        this.stop();
    }

    private saveState() {
        this.localSettingsService.updateSettings({
            hitsquadRounds: this.remainingRounds
        });
    }

    private getDelay() {
        // return random(11 * Timing.SECOND, 20 * Timing.SECOND) // + config.hitsquadGameBaseTimeout;
        return random(30 * Timing.SECOND, 2 * Timing.MINUTE) + config.hitsquadGameBaseTimeout;
    }

    private scheduleRound() {
        const delay = this.getDelay();

        this.timeUntilMessage = Date.now() + delay;

        this.timeout = window.setTimeout(async () => {
            await this.processRound();

            if (this.isGameRunning && this.remainingRounds > 0) {
                this.scheduleRound();
            } else {
                this.stop();
            }
        }, delay);
    }

    private async processRound() {
        if (!this.streamStatusService.isBotWorking) {
            return;
        }

        while (!this.streamStatusService.isMiniGamesAllowed) {
            const delay = random(10 * Timing.SECOND, 30 * Timing.SECOND);

            this.timeUntilMessage = Date.now() + delay;

            while (Date.now() < this.timeUntilMessage) {
                if (!this.isGameRunning) {
                    return;
                }

                await wait(Timing.SECOND * 0.1);
            }
        }

        if (!this.isGameRunning) return;

        this.sendCommand();
        this.remainingRounds -= HitsquadGameService.HITSQUAD_GAMES_ON_SCREEN;
        this.saveState();
    }
}
