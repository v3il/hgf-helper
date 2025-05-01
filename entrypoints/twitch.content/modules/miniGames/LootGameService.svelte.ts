import { Timing } from '@shared/consts';
import { getRandomNumber, waitAsync } from '@utils';
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
    private readonly unsubscribe!: UnsubscribeTrigger;

    isGamePhase = $state(false);
    isGameActive = $state(false);
    isRoundRunning = $state(false);
    timeUntilMessage = $state(0);

    constructor() {
        this.messageSender = Container.get(MessageSender);
        this.settingsFacade = Container.get(SettingsFacade);
        this.streamStatusService = Container.get(StreamStatusService);

        this.isGameActive = this.settingsFacade.settings.lootGame;
        this.isGamePhase = this.streamStatusService.isLootGame;

        this.unsubscribe = this.streamStatusService.events.on('loot', (isGamePhase?: boolean) => {
            this.isGamePhase = !!isGamePhase;

            if (this.isGameActive) {
                this.isGamePhase ? this.scheduleNextRound() : this.stop();
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
        this.stop();
        this.unsubscribe();
    }

    participate() {
        this.messageSender.sendMessage(`${COMMAND}${getRandomNumber(1, 8)}`);
    }

    private async saveState() {
        await this.settingsFacade.updateSettings({
            lootGame: this.isGameActive
        });
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
