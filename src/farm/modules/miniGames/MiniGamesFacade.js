import { HitsquadRunner, TriviaRunner } from './services';
import { BasicFacade } from '../../BasicFacade';
import { ChatFacade } from '../chat';
import { StreamFacade } from '../stream';

export class MiniGamesFacade extends BasicFacade {
    static providers = [
        { id: HitsquadRunner, type: HitsquadRunner },
        { id: TriviaRunner, type: TriviaRunner }
        // { id: ChatFacade, type: ChatFacade.instance }
        // { id: StreamFacade, type: StreamFacade.instance }
    ];

    #hitsquadRunner;
    #triviaRunner;

    constructor(container) {
        super();

        this.#hitsquadRunner = container.get(HitsquadRunner);
        this.#triviaRunner = container.get(TriviaRunner);

        console.error('MiniGamesFacade');
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
