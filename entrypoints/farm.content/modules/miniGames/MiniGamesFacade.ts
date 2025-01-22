import { SettingsFacade } from '@components/shared';
import { HitsquadRunner, AkirasDrawingRunner } from './services';
import { ChatFacade } from '../chat';
import { StreamFacade } from '../stream';

interface IParams {
    hitsquadRunner: HitsquadRunner;
    akiraDrawRunner: AkirasDrawingRunner;
}

export class MiniGamesFacade {
    static _instance: MiniGamesFacade;

    static get instance() {
        if (!this._instance) {
            const hitsquadRunner = new HitsquadRunner({
                chatFacade: ChatFacade.instance,
                streamFacade: StreamFacade.instance,
                settingsFacade: SettingsFacade.instance
            });

            const akiraDrawRunner = new AkirasDrawingRunner({
                chatFacade: ChatFacade.instance,
                settingsFacade: SettingsFacade.instance
            });

            this._instance = new MiniGamesFacade({ hitsquadRunner, akiraDrawRunner });
        }

        return this._instance;
    }

    private readonly hitsquadRunner;
    private readonly akiraDrawRunner;

    constructor({ hitsquadRunner, akiraDrawRunner }: IParams) {
        this.hitsquadRunner = hitsquadRunner;
        this.akiraDrawRunner = akiraDrawRunner;
    }

    get hitsquadEvents() {
        return this.hitsquadRunner.events;
    }

    get isHitsquadRunning() {
        return this.hitsquadRunner.isRunning;
    }

    startHitsquadRunner(rounds: number) {
        this.hitsquadRunner.start(rounds);
    }

    stopHitsquadRunner() {
        this.hitsquadRunner.stop();
    }

    get isAkiraDrawRunning() {
        return this.akiraDrawRunner.isRunning;
    }

    startAkiraDrawRunner() {
        this.akiraDrawRunner.start();
    }

    stopAkiraDrawRunner() {
        this.akiraDrawRunner.stop();
    }
}
