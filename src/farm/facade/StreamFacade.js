import { Container } from 'typedi';
import { InjectionTokens } from '../consts';

export class StreamFacade {
    static create() {
        return new StreamFacade();
    }

    #streamStatusService;
    #twitchPlayerService;

    constructor() {
        this.#streamStatusService = Container.get(InjectionTokens.STREAM_STATUS_SERVICE);
        this.#twitchPlayerService = Container.get(InjectionTokens.PLAYER_SERVICE);
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
