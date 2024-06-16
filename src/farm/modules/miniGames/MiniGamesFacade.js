import { HitsquadRunner, TriviaRunner } from './services';
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

            const triviaRunner = new TriviaRunner({
                chatFacade: ChatFacade.instance
            });

            this._instance = new MiniGamesFacade({
                hitsquadRunner,
                triviaRunner
            });
        }

        return this._instance;
    }

    #hitsquadRunner;
    #triviaRunner;

    constructor({ hitsquadRunner, triviaRunner }) {
        this.#hitsquadRunner = hitsquadRunner;
        this.#triviaRunner = triviaRunner;
    }

    startHitsquadRunner({ gamesCount }) {
        this.#hitsquadRunner.start({ gamesCount });
    }

    stopHitsquadRunner() {
        this.#hitsquadRunner.stop();
    }

    onHitsquadRunnerStop(callback) {
        this.#hitsquadRunner.events.on('hitsquadRunner:stop', callback);
    }

    startTriviaRunner() {
        this.#triviaRunner.start();
    }

    stopTriviaRunner() {
        this.#triviaRunner.stop();
    }
}
