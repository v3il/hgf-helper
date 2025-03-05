import { SettingsFacade, AiGeneratorService } from '@components/shared';
import { TwitchFacade } from '@farm/modules/twitch';
import {
    HitsquadRunner, AkirasDrawingRunner, ChestGameRunner, LootGameRunner
} from './services';
import { ChatFacade } from '../chat';
import { StreamFacade } from '../stream';

interface IParams {
    hitsquadRunner: HitsquadRunner;
    akiraDrawRunner: AkirasDrawingRunner;
    chestGameRunner: ChestGameRunner;
    lootGameRunner: LootGameRunner;
}

export class MiniGamesFacade {
    static _instance: MiniGamesFacade;

    static get instance() {
        if (!this._instance) {
            const hitsquadRunner = new HitsquadRunner({
                chatFacade: ChatFacade.instance,
                streamFacade: StreamFacade.instance,
                settingsFacade: SettingsFacade.instance,
                twitchFacade: TwitchFacade.instance
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

            const lootGameRunner = new LootGameRunner({
                chatFacade: ChatFacade.instance,
                settingsFacade: SettingsFacade.instance
            });

            this._instance = new MiniGamesFacade({
                hitsquadRunner, akiraDrawRunner, chestGameRunner, lootGameRunner
            });
        }

        return this._instance;
    }

    private readonly hitsquadRunner;
    private readonly akiraDrawRunner;
    private readonly chestGameRunner;
    private readonly lootGameRunner;

    constructor({
        hitsquadRunner, akiraDrawRunner, chestGameRunner, lootGameRunner
    }: IParams) {
        this.hitsquadRunner = hitsquadRunner;
        this.akiraDrawRunner = akiraDrawRunner;
        this.chestGameRunner = chestGameRunner;
        this.lootGameRunner = lootGameRunner;
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

    get isLootGameRunning() {
        return this.lootGameRunner.isRunning;
    }

    get timeUntilLootMessage() {
        return this.lootGameRunner.timeUntilMessage;
    }

    startLootRunner() {
        this.lootGameRunner.start();
    }

    stopLootRunner() {
        this.lootGameRunner.stop();
    }

    participateLootGameOnce() {
        return this.lootGameRunner.participateOnce();
    }
}
