import { HitsquadRunner } from './services';
import { ChatFacade } from '../chat';
import { StreamFacade } from '../stream';
import { EventEmitter } from '@/components/shared';

export class MiniGamesFacade {
    static _instance: unknown;

    static get instance() {
        if (!this._instance) {
            const hitsquadRunner = new HitsquadRunner({
                chatFacade: ChatFacade.instance,
                streamFacade: StreamFacade.instance,
                events: EventEmitter.create()
            });

            this._instance = new MiniGamesFacade(hitsquadRunner);
        }

        return this._instance;
    }

    private hitsquadRunner;

    constructor(hitsquadRunner: HitsquadRunner) {
        this.hitsquadRunner = hitsquadRunner;
    }

    startHitsquadRunner({ totalRounds }: {totalRounds: number }) {
        this.hitsquadRunner.start({ totalRounds });
    }

    stopHitsquadRunner() {
        this.hitsquadRunner.stop();
    }

    onHitsquadRoundEnd(callback: () => void) {
        this.hitsquadRunner.events.on('hitsquadRunner:round', callback);
    }
}
