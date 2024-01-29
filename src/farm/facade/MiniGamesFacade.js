import { Container } from 'typedi';
import { HitsquadRunner, QuizService } from '../services';
import { InjectionTokens } from '../consts';
import { SettingsFacade } from './SettingsFacade';

export class MiniGamesFacade {
    static create() {
        const container = Container.of('miniGames');
        const settingsFacade = Container.get(InjectionTokens.SETTINGS_FACADE);

        console.error(1, settingsFacade);

        container.set([
            { id: HitsquadRunner, type: HitsquadRunner },
            { id: InjectionTokens.SETTINGS_FACADE, value: settingsFacade }
            // { id: TriviaRunner, factory: () => TriviaRunner.create() }
        ]);

        return new MiniGamesFacade({ container });
    }

    #hitsquadRunner;
    #triviaRunner;

    constructor({ container }) {
        this.#hitsquadRunner = container.get(HitsquadRunner);
        this.#triviaRunner = container.get(QuizService);
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
