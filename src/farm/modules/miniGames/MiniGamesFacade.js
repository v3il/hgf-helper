import { HitsquadRunner } from './services';
import { ChatFacade } from '../chat';
import { StreamFacade } from '../stream';
import { EventEmitter } from '@/farm/modules/shared';

export class MiniGamesFacade {
    static _instance;

    static get instance() {
        if (!this._instance) {
            const hitsquadRunner = new HitsquadRunner({
                chatFacade: ChatFacade.instance,
                streamFacade: StreamFacade.instance,
                events: EventEmitter.create()
            });

            this._instance = new MiniGamesFacade({
                hitsquadRunner
            });
        }

        return this._instance;
    }

    #hitsquadRunner;

    constructor({ hitsquadRunner }) {
        this.#hitsquadRunner = hitsquadRunner;
    }

    startHitsquadRunner({ totalRounds }) {
        this.#hitsquadRunner.start({ totalRounds });
    }

    stopHitsquadRunner() {
        this.#hitsquadRunner.stop();
    }

    onHitsquadRoundEnd(callback) {
        this.#hitsquadRunner.events.on('hitsquadRunner:round', callback);
    }
}
