import { Timing } from '@shared/consts';
import { wait } from '@utils';
import { Container } from 'typedi';
import { MessageSender } from '@twitch/modules/twitchChat';
import { StreamStatusService } from '@twitch/modules/stream';
import { UnsubscribeTrigger } from '@shared/EventEmitter';
import { random } from 'lodash';
import { LocalSettingsService } from '@shared/services';
import { ITwitchLocalSettings } from '@twitch/modules';

interface ILootGameServiceParams {
    localSettingsService: LocalSettingsService<ITwitchLocalSettings>;
}

export class LootGameService {
    readonly command = '!loot';

    private readonly messageSender: MessageSender;
    private readonly streamStatusService: StreamStatusService;
    private readonly localSettingsService: LocalSettingsService<ITwitchLocalSettings>;

    private timeoutId!: number;
    private unsubscribe!: UnsubscribeTrigger;

    isGamePhase = $state(false);
    isGameActive = $state(false);
    isRoundRunning = $state(false);
    timeUntilMessage = $state(0);

    constructor({ localSettingsService }: ILootGameServiceParams) {
        this.localSettingsService = localSettingsService;
        this.messageSender = Container.get(MessageSender);
        this.streamStatusService = Container.get(StreamStatusService);
    }

    init() {
        this.isGameActive = this.localSettingsService.settings.lootGame;
        this.isGamePhase = this.streamStatusService.isLootGame;

        this.unsubscribe = this.streamStatusService.events.on('loot', (isGamePhase?: boolean) => {
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
        this.stop();
        this.unsubscribe?.();
    }

    participate() {
        this.messageSender.sendMessage(`${this.command}${random(1, 8)}`);
    }

    private saveState() {
        this.localSettingsService.updateSettings({
            lootGame: this.isGameActive
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
        return random(Timing.MINUTE, 15 * Timing.MINUTE);
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
