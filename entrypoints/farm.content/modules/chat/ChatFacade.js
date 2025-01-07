import { TwitchChatObserver, TwitchChatService } from './services';
import { TwitchFacade } from '../twitch';

export class ChatFacade {
    static _instance;

    static get instance() {
        if (!this._instance) {
            const twitchChatService = new TwitchChatService();
            const twitchChatObserver = new TwitchChatObserver({ twitchFacade: TwitchFacade.instance });

            this._instance = new ChatFacade({
                twitchChatService,
                twitchChatObserver
            });
        }

        return this._instance;
    }

    #chatObserver;
    #chatService;

    constructor({ twitchChatService, twitchChatObserver }) {
        this.#chatObserver = twitchChatObserver;
        this.#chatService = twitchChatService;
    }

    sendMessage(message, forced) {
        this.#chatService.sendMessage(message, forced);
    }

    observeChat(callback) {
        return this.#chatObserver.events.on('message', callback);
    }
}
