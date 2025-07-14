import { Timing } from '@shared/consts';
import { wait } from '@utils';
import { MessageSender } from '@twitch/modules/twitchChat';
import { Container } from 'typedi';
import { StreamStatusService } from '@twitch/modules/stream';
import { UnsubscribeTrigger } from '@shared/EventEmitter';
import { random } from 'lodash';
import { LocalSettingsService } from '@shared/services';
import { ITwitchLocalSettings } from '@twitch/modules';

interface IChestGameServiceParams {
    localSettingsService: LocalSettingsService<ITwitchLocalSettings>;
}

export class ChestGameService {
    readonly command = '!chest';

    private readonly messageSender: MessageSender;
    private readonly streamStatusService: StreamStatusService;
    private readonly localSettingsService: LocalSettingsService<ITwitchLocalSettings>;

    private timeoutId!: number;
    private unsubscribe!: UnsubscribeTrigger;

    isGamePhase = $state(false);
    isGameEnabled = $state(false);
    isRoundRunning = $state(false);
    timeUntilMessage = $state(0);

    constructor({ localSettingsService }: IChestGameServiceParams) {
        this.localSettingsService = localSettingsService;
        this.messageSender = Container.get(MessageSender);
        this.streamStatusService = Container.get(StreamStatusService);
    }

    init() {
        this.isGameEnabled = this.localSettingsService.settings.chestGame;
        this.isGamePhase = this.streamStatusService.isChestGame;

        this.unsubscribe = this.streamStatusService.events.on('chest', (isGamePhase?: boolean) => {
            this.isGamePhase = !!isGamePhase;

            if (this.isGameEnabled && this.isGamePhase && !this.isRoundRunning) {
                this.scheduleNextRound();
            }
        });
    }

    start() {
        this.isGameEnabled = true;
        this.saveState();
    }

    stop() {
        this.isRoundRunning = false;
        this.isGameEnabled = false;

        this.saveState();
        clearTimeout(this.timeoutId);
    }

    destroy() {
        this.stop();
        this.unsubscribe?.();
    }

    sendCommand() {
        this.messageSender.sendMessage(`${this.command}${random(1, 8)}`);
    }

    private saveState() {
        this.localSettingsService.updateSettings({
            chestGame: this.isGameEnabled
        });
    }

    private getDelay() {
        return random(30 * Timing.SECOND, 1 * Timing.MINUTE);
    }

    private scheduleNextRound() {
        const delay = this.getDelay();

        this.isRoundRunning = true;
        this.timeUntilMessage = Date.now() + delay;

        this.timeoutId = window.setTimeout(async () => {
            if (!this.streamStatusService.isBotWorking) {
                this.isRoundRunning = false;
                return;
            }

            while (!this.streamStatusService.isMiniGamesAllowed) {
                const delay = random(10 * Timing.SECOND, 11 * Timing.SECOND);

                console.error('while loop in ChestGameService', delay);

                this.timeUntilMessage = Date.now() + delay;
                await wait(delay);

                if (!(this.isGameEnabled && this.isGamePhase)) {
                    return;
                }
            }

            if (!(this.isGameEnabled && this.isGamePhase)) {
                return;
            }

            this.sendCommand();
            this.isRoundRunning = false;
        }, delay);
    }
}
