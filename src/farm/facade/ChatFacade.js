import { Container } from 'typedi';
import { InjectionTokens } from '../consts';

export class ChatFacade {
    static create() {
        return new ChatFacade();
    }

    #twitchChatService;
    #twitchChatObserver;

    constructor() {
        this.#twitchChatService = Container.get(InjectionTokens.CHAT_SERVICE);
        this.#twitchChatObserver = Container.get(InjectionTokens.CHAT_OBSERVER);
    }

    sendMessage(message, forced) {
        this.#twitchChatService.sendMessage(message, forced);
    }

    onMessage(callback) {
        this.#twitchChatObserver.events.on('message', callback);
    }
}
