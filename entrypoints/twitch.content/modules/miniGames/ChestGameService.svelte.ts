import { Timing } from '@shared/consts';
import { wait } from '@utils';
import { MessageSender } from '@twitch/modules/twitchChat';
import { Container } from 'typedi';
import { StreamStatusService } from '@twitch/modules/stream';
import { UnsubscribeTrigger } from '@shared/EventEmitter';
import { SettingsFacade } from '@shared/modules';
import { random } from 'lodash';

const COMMAND = '!chest';

export class ChestGameService {
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

        this.isGameActive = this.settingsFacade.settings.chestGame;
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
        this.messageSender.sendMessage(`${COMMAND}${random(1, 8)}`);
    }

    private async saveState() {
        await this.settingsFacade.updateSettings({
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
