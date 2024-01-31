import { TwitchChatObserver, TwitchChatService } from './services';
import { BasicFacade } from '../../BasicFacade';
import { TwitchFacade } from '../twitch';

export class ChatFacade extends BasicFacade {
    static providers = [
        { id: TwitchChatObserver, type: TwitchChatObserver },
        { id: TwitchChatService, type: TwitchChatService },
        { id: TwitchFacade, value: TwitchFacade.instance }
    ];

    #chatObserver;
    #chatService;

    constructor(container) {
        super();

        this.#chatObserver = container.get(TwitchChatObserver);
        this.#chatService = container.get(TwitchChatService);
    }

    sendMessage(message, forced) {
        this.#chatService.sendMessage(message, forced);
    }

    observeChat(callback) {
        this.#chatObserver.events.on('message', callback);
    }
}
