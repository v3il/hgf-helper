import { Timing } from '@shared/consts';
import { random } from 'lodash';
import { config } from '@twitch/config';
import { MiniGameBaseServiceSvelte } from './MiniGameBaseService.svelte';

export class HitsquadGameService extends MiniGameBaseServiceSvelte {
    readonly command = '!hitsquad';
    static readonly HITSQUAD_GAMES_PER_DAY = 600;
    static readonly HITSQUAD_GAMES_ON_SCREEN = 12;

    remainingRounds = $state(0);
    totalRounds = $state(0);
    isGameRunning = $derived(this.remainingRounds > 0);

    private timeoutId!: number;

    init() {
        this.remainingRounds = this.localSettingsService.settings.hitsquadRounds;

        if (this.shouldHandleGame) {
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

        clearTimeout(this.timeoutId);
    }

    buildCommand() {
        return this.command;
    }

    destroy() {
        this.stop();
    }

    protected saveState() {
        this.localSettingsService.updateSettings({
            hitsquadRounds: this.remainingRounds
        });
    }

    protected get shouldHandleGame(): boolean {
        return this.isGameRunning && this.remainingRounds > 0;
    }

    protected getDelay() {
        return random(30 * Timing.SECOND, 2 * Timing.MINUTE) + config.hitsquadGameBaseTimeout;
    }

    protected scheduleRound() {
        const delay = this.getDelay();

        this.timeUntilMessage = Date.now() + delay;

        this.timeoutId = window.setTimeout(async () => {
            await this.processRound();

            if (this.shouldHandleGame) {
                this.scheduleRound();
            } else {
                this.stop();
            }
        }, delay);
    }

    protected completeRound() {
        this.sendCommand();
        this.remainingRounds -= HitsquadGameService.HITSQUAD_GAMES_ON_SCREEN;
        this.saveState();
    }
}
