import { SettingsFacade, AiGeneratorService } from '@components/shared';
import { TwitchFacade } from '@farm/modules/twitch';
import { HitsquadRunner, AkirasDrawingRunner, ChestGameRunner } from './services';
import { ChatFacade } from '../chat';
import { StreamFacade } from '../stream';

interface IParams {
    hitsquadRunner: HitsquadRunner;
    akiraDrawRunner: AkirasDrawingRunner;
    chestGameRunner: ChestGameRunner;
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
                settingsFacade: SettingsFacade.instance,
                twitchFacade: TwitchFacade.instance,
                aiGeneratorService: new AiGeneratorService()
            });

            const chestGameRunner = new ChestGameRunner({
                chatFacade: ChatFacade.instance,
                settingsFacade: SettingsFacade.instance
            });

            this._instance = new MiniGamesFacade({ hitsquadRunner, akiraDrawRunner, chestGameRunner });
        }

        return this._instance;
    }

    private readonly hitsquadRunner;
    private readonly akiraDrawRunner;
    private readonly chestGameRunner;

    constructor({ hitsquadRunner, akiraDrawRunner, chestGameRunner }: IParams) {
        this.hitsquadRunner = hitsquadRunner;
        this.akiraDrawRunner = akiraDrawRunner;
        this.chestGameRunner = chestGameRunner;
    }

    get hitsquadEvents() {
        return this.hitsquadRunner.events;
    }

    get isHitsquadRunning() {
        return this.hitsquadRunner.isRunning;
    }

    get timeUntilHitsquadMessage() {
        return this.hitsquadRunner.timeUntilMessage;
    }

    get hitsquadRoundsData() {
        return this.hitsquadRunner.roundsData;
    }

    startHitsquadRunner(rounds: number) {
        this.hitsquadRunner.start(rounds);
    }

    stopHitsquadRunner() {
        this.hitsquadRunner.stop();
    }

    participateHitsquadOnce() {
        return this.hitsquadRunner.participateOnce();
    }

    get isAkiraDrawRunning() {
        return this.akiraDrawRunner.isRunning;
    }

    get timeUntilAkiraDrawingMessage() {
        return this.akiraDrawRunner.timeUntilMessage;
    }

    startAkiraDrawRunner() {
        this.akiraDrawRunner.start();
    }

    stopAkiraDrawRunner() {
        this.akiraDrawRunner.stop();
    }

    participateAkiraDrawingOnce() {
        return this.akiraDrawRunner.participateOnce();
    }

    get isChestGameRunning() {
        return this.chestGameRunner.isRunning;
    }

    get timeUntilChestMessage() {
        return this.chestGameRunner.timeUntilMessage;
    }

    startChestRunner() {
        this.chestGameRunner.start();
    }

    stopChestRunner() {
        this.chestGameRunner.stop();
    }

    participateChestGameOnce() {
        return this.chestGameRunner.participateOnce();
    }
}
