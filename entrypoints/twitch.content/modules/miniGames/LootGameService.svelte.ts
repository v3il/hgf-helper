import { Timing } from '@shared/consts';
import { getRandomNumber, log, waitAsync } from '@utils';
import { Container } from 'typedi';
import { MessageSender } from '@twitch/modules/twitchChat';
import { StreamStatusService } from '@twitch/modules/stream';
import { UnsubscribeTrigger } from '@shared/EventEmitter';
import { SettingsFacade } from '@shared/modules';

const COMMAND = '!loot';

export class LootGameService {
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

        this.isGamePhase = this.streamStatusService.isLootGame;

        this.unsubscribe = this.streamStatusService.events.on('loot', (isGamePhase?: boolean) => {
            this.isGamePhase = !!isGamePhase;

            if (this.settingsFacade.settings.lootGame) {
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
        return getRandomNumber(Timing.MINUTE, 15 * Timing.MINUTE);
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
