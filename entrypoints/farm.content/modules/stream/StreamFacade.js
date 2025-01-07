import { DebugModeService, StreamStatusService, TwitchPlayerService } from './services';
import { TwitchFacade } from '../twitch';

export class StreamFacade {
    static _instance;

    static get instance() {
        if (!this._instance) {
            const twitchPlayerService = new TwitchPlayerService();
            const debugModeService = new DebugModeService();
            const streamStatusService = new StreamStatusService();

            this._instance = new StreamFacade({
                twitchPlayerService,
                debugModeService,
                streamStatusService,
                twitchFacade: TwitchFacade.instance
            });
        }

        return this._instance;
    }

    #streamStatusService;
    #twitchPlayerService;
    #debugModeService;
    #twitchFacade;

    constructor({
        twitchPlayerService, debugModeService, streamStatusService, twitchFacade
    }) {
        this.#streamStatusService = streamStatusService;
        this.#twitchPlayerService = twitchPlayerService;
        this.#debugModeService = debugModeService;
        this.#twitchFacade = twitchFacade;
    }

    get isVideoBroken() {
        return this.#streamStatusService.isVideoBroken;
    }

    get isAntiCheatScreen() {
        return this.#streamStatusService.isAntiCheatScreen;
    }

    get isAllowedToSendMessage() {
        return this.#streamStatusService.isAllowedToSendMessage;
    }

    checkStreamStatus() {
        this.#streamStatusService.checkStreamStatus(this.#twitchFacade.activeVideoEl);
    }

    decreaseVideoDelay() {
        this.#twitchPlayerService.decreaseVideoDelay();
    }

    enterDebugMode() {
        this.#debugModeService.renderVideoFrame(this.#twitchFacade.activeVideoEl);
        this.#debugModeService.enterDebugMode();
    }

    exitDebugMode() {
        this.#debugModeService.exitDebugMode();
    }
}
