import { SettingsFacade } from '@components/shared';
import { HitsquadRunner } from './services';
import { ChatFacade } from '../chat';
import { StreamFacade } from '../stream';

export class MiniGamesFacade {
    static _instance: MiniGamesFacade;

    static get instance() {
        if (!this._instance) {
            const hitsquadRunner = new HitsquadRunner({
                chatFacade: ChatFacade.instance,
                streamFacade: StreamFacade.instance,
                settingsFacade: SettingsFacade.instance
            });

            this._instance = new MiniGamesFacade(hitsquadRunner);
        }

        return this._instance;
    }

    private hitsquadRunner;

    constructor(hitsquadRunner: HitsquadRunner) {
        this.hitsquadRunner = hitsquadRunner;
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
}
