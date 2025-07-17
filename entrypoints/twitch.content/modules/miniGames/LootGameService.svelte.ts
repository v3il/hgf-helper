import { Timing } from '@shared/consts';
import { UnsubscribeTrigger } from '@shared/EventEmitter';
import { random } from 'lodash';
import { MiniGameBaseServiceSvelte } from './MiniGameBaseService.svelte';

export class LootGameService extends MiniGameBaseServiceSvelte {
    readonly command = '!loot';

    private timeoutId!: number;
    private unsubscribe!: UnsubscribeTrigger;

    isGamePhase = $state(false);
    isGameEnabled = $state(false);
    isRoundRunning = $state(false);

    init() {
        this.isGameEnabled = this.localSettingsService.settings.lootGame;
        this.isGamePhase = this.streamStatusService.isLootGame;

        this.unsubscribe = this.streamStatusService.events.on('loot', (isGamePhase?: boolean) => {
            this.isGamePhase = !!isGamePhase;

            if (this.shouldHandleGame) {
                this.scheduleRound();
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

    protected buildCommand() {
        return `${this.command}${random(1, 8)}`;
    }

    protected get shouldHandleGame() {
        return this.isGameEnabled && this.isGamePhase;
    }

    protected saveState() {
        this.localSettingsService.updateSettings({
            lootGame: this.isGameEnabled
        });
    }

    protected getDelay() {
        return random(Timing.MINUTE, 15 * Timing.MINUTE);
    }

    protected completeRound() {
        this.sendCommand();
    }

    protected scheduleRound() {
        const delay = this.getDelay();

        this.timeUntilMessage = Date.now() + delay;
        this.isRoundRunning = true;

        this.timeoutId = window.setTimeout(async () => {
            await this.processRound();
            this.isRoundRunning = false;
        }, delay);
    }
}
