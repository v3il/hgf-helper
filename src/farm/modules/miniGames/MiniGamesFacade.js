import { HitsquadRunner, TriviaRunner } from './services';
import { ChatFacade } from '../chat';
import { StreamFacade } from '../stream';

export class MiniGamesFacade {
    static _instance;

    static get instance() {
        if (!this._instance) {
            const hitsquadRunner = new HitsquadRunner({
                chatFacade: ChatFacade.instance,
                streamFacade: StreamFacade.instance
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

    startHitsquadRunner() {
        this.#hitsquadRunner.start();
    }

    stopHitsquadRunner() {
        this.#hitsquadRunner.stop();
    }

    startTriviaRunner() {
        this.#triviaRunner.start();
    }

    stopTriviaRunner() {
        this.#triviaRunner.stop();
    }
}
