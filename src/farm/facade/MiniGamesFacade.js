import { Container } from 'typedi';
import { InjectionTokens } from '../consts';

export class MiniGamesFacade {
    static create() {
        return new MiniGamesFacade();
    }

    #hitsquadRunner;
    #quizRunner;

    constructor() {
        this.#hitsquadRunner = Container.get(InjectionTokens.HITSQUAD_RUNNER);
        this.#quizRunner = Container.get(InjectionTokens.QUIZ_RUNNER);
    }

    startHitsquadRunner() {
        this.#hitsquadRunner.start();
    }

    stopHitsquadRunner() {
        this.#hitsquadRunner.stop();
    }

    startQuizRunner() {
        this.#quizRunner.start();
    }

    stopQuizRunner() {
        this.#quizRunner.stop();
    }
}
