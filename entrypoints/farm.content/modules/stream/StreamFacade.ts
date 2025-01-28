import { StreamStatusService, TwitchPlayerService } from './services';
import { TwitchFacade } from '../twitch';

interface IParams {
    twitchPlayerService: TwitchPlayerService;
    streamStatusService: StreamStatusService;
}

export class StreamFacade {
    static _instance: StreamFacade;

    static get instance() {
        if (!this._instance) {
            const twitchPlayerService = new TwitchPlayerService();
            const streamStatusService = new StreamStatusService(TwitchFacade.instance);

            this._instance = new StreamFacade({
                twitchPlayerService,
                streamStatusService
            });
        }

        return this._instance;
    }

    private readonly streamStatusService;
    private readonly twitchPlayerService;

    constructor({ twitchPlayerService, streamStatusService }: IParams) {
        this.streamStatusService = streamStatusService;
        this.twitchPlayerService = twitchPlayerService;
    }

    get isVideoBroken() {
        return this.streamStatusService.isVideoBroken;
    }

    get isAntiCheatScreen() {
        return this.streamStatusService.isAntiCheatScreen;
    }

    get isStreamOk() {
        return this.streamStatusService.isStreamOk;
    }

    get isGiveawayFrenzy() {
        return this.streamStatusService.isGiveawayFrenzy;
    }

    checkStreamStatus() {
        this.streamStatusService.checkStreamStatus();
    }

    decreaseVideoDelay() {
        this.twitchPlayerService.decreaseVideoDelay();
    }
}
