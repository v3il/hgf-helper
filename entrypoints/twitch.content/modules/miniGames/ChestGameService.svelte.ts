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
    private readonly unsubscribe!: UnsubscribeTrigger;

    isGamePhase = $state(false);
    isGameActive = $state(false);
    isRoundRunning = $state(false);
    timeUntilMessage = $state(0);

    constructor({ localSettingsService }: IChestGameServiceParams) {
        this.localSettingsService = localSettingsService;
        this.messageSender = Container.get(MessageSender);
        this.streamStatusService = Container.get(StreamStatusService);

        this.isGameActive = localSettingsService.settings.chestGame;
        this.isGamePhase = this.streamStatusService.isChestGame;

        this.unsubscribe = this.streamStatusService.events.on('chest', (isGamePhase?: boolean) => {
            this.isGamePhase = !!isGamePhase;

            if (this.isGameActive && this.isGamePhase) {
                 this.scheduleNextRound();
            }
        });
    }

    start() {
        this.isGameActive = true;
        this.saveState();
    }

    stop() {
        this.isRoundRunning = false;
        this.isGameActive = false;

        this.saveState();
        clearTimeout(this.timeoutId);
    }

    destroy() {
        this.isRoundRunning = false;
        this.isGameActive = false;

        clearTimeout(this.timeoutId);
        this.unsubscribe();
    }

    participate() {
        this.messageSender.sendMessage(`${this.command}${random(1, 8)}`);
    }

    private saveState() {
        this.localSettingsService.updateSettings({
            chestGame: this.isGameActive
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
        this.isRoundRunning = false;
    }

    private getDelay() {
        return random(30 * Timing.SECOND, 4 * Timing.MINUTE);
    }

    private scheduleNextRound() {
        const delay = this.getDelay();

        this.isRoundRunning = true;
        this.timeUntilMessage = Date.now() + delay;

        this.timeoutId = window.setTimeout(() => {
            if (!this.streamStatusService.isBotWorking) {
                this.isRoundRunning = false;
                return;
            }

            this.sendCommand();
        }, delay);
    }
}
