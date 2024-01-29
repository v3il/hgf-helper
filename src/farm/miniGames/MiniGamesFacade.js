import { HitsquadRunner, TriviaRunner } from './services';
import { SettingsFacade } from '../settings';
import { BasicFacade } from '../BasicFacade';

export class MiniGamesFacade extends BasicFacade {
    static providers = [
        { id: HitsquadRunner, type: HitsquadRunner },
        { id: TriviaRunner, type: TriviaRunner },
        { id: SettingsFacade, value: SettingsFacade.instance }
    ];

    #hitsquadRunner;
    #triviaRunner;

    constructor(container) {
        super();

        this.#hitsquadRunner = container.get(HitsquadRunner);
        this.#triviaRunner = container.get(TriviaRunner);
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
