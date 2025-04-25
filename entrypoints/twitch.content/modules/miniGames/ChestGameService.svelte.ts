import { Timing } from '@shared/consts';
import { getRandomNumber, waitAsync } from '@utils';
import { MessageSender } from '@twitch/modules/twitchChat';
import { Container } from 'typedi';
import { StreamStatusService } from '@twitch/modules/stream';
import { UnsubscribeTrigger } from '@shared/EventEmitter';
import { SettingsFacade } from '@shared/modules';

const COMMAND = '!chest';

export class ChestGameService {
    private readonly messageSender: MessageSender;
    private readonly settingsFacade: SettingsFacade;
    private readonly streamStatusService: StreamStatusService;

    private timeoutId!: number;
    private unsubscribe!: UnsubscribeTrigger;

    isGamePhase = $state(false);
    isRoundRunning = $state(false);
    timeUntilMessage = $state(0);

    constructor() {
        this.messageSender = Container.get(MessageSender);
        this.settingsFacade = Container.get(SettingsFacade);
        this.streamStatusService = Container.get(StreamStatusService);

        this.isGamePhase = this.streamStatusService.isChestGame;

        this.unsubscribe = this.streamStatusService.events.on('chest', (isGamePhase?: boolean) => {
            this.isGamePhase = !!isGamePhase;

            if (this.settingsFacade.settings.chestGame) {
                this.isGamePhase ? this.start() : this.stop();
            }
        });
    }

    start() {
        this.scheduleNextRound();
    }

    stop() {
        clearTimeout(this.timeoutId);
        this.isRoundRunning = false;
    }

    destroy() {
        this.stop();
        this.unsubscribe();
    }

    participate() {
        this.messageSender.sendMessage(`${COMMAND}${getRandomNumber(1, 8)}`);
    }

    private async sendCommand(): Promise<void> {
        if (this.streamStatusService.isVideoBroken) {
            const delay = 20 * Timing.SECOND;

            this.timeUntilMessage = Date.now() + delay;
            await waitAsync(delay);
            return this.sendCommand();
        }

        this.messageSender.sendMessage(`${COMMAND}${getRandomNumber(1, 8)}`);
        this.isRoundRunning = false;
    }

    private getDelay() {
        return getRandomNumber(30 * Timing.SECOND, 5 * Timing.MINUTE);
    }

    private scheduleNextRound() {
        const delay = this.getDelay();

        this.isRoundRunning = true;
        this.timeUntilMessage = Date.now() + delay;

        this.timeoutId = window.setTimeout(() => {
            this.sendCommand();
        }, delay);
    }
}
