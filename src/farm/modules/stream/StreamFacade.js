import { StreamStatusService, TwitchPlayerService } from './services';
import { BasicFacade } from '../../BasicFacade';

export class StreamFacade extends BasicFacade {
    static providers = [
        { id: StreamStatusService, type: StreamStatusService },
        { id: TwitchPlayerService, type: TwitchPlayerService }
    ];

    #streamStatusService;
    #twitchPlayerService;

    constructor(container) {
        super();

        this.#streamStatusService = container.get(StreamStatusService);
        this.#twitchPlayerService = container.get(TwitchPlayerService);
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

    checkStreamStatus(activeVideoEl) {
        this.#streamStatusService.checkStreamStatus(activeVideoEl);
    }

    decreaseVideoDelay() {
        this.#twitchPlayerService.decreaseVideoDelay();
    }
}
