import { DebugModeService, StreamStatusService, TwitchPlayerService } from './services';
import { BasicFacade } from '../../BasicFacade';
import { TwitchFacade } from '../twitch';

export class StreamFacade extends BasicFacade {
    static providers = [
        { id: StreamStatusService, type: StreamStatusService },
        { id: TwitchPlayerService, type: TwitchPlayerService },
        { id: DebugModeService, type: DebugModeService },
        { id: TwitchFacade, value: TwitchFacade.instance }
    ];

    #streamStatusService;
    #twitchPlayerService;
    #debugModeService;
    #twitchFacade;

    constructor(container) {
        super();

        this.#streamStatusService = container.get(StreamStatusService);
        this.#twitchPlayerService = container.get(TwitchPlayerService);
        this.#debugModeService = container.get(DebugModeService);
        this.#twitchFacade = container.get(TwitchFacade);
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
