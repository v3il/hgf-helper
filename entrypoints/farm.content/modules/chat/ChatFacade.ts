import { IChatMessage, TwitchChatObserver, TwitchChatService } from './services';
import { TwitchFacade } from '../twitch';

interface IChatFacadeParams {
    twitchChatService: TwitchChatService;
    twitchChatObserver: TwitchChatObserver;
}

export class ChatFacade {
    static _instance: ChatFacade;

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

    private chatObserver: TwitchChatObserver;
    private chatService: TwitchChatService;

    constructor({ twitchChatService, twitchChatObserver }: IChatFacadeParams) {
        this.chatObserver = twitchChatObserver;
        this.chatService = twitchChatService;
    }

    sendMessage(message: string, forced?: boolean) {
        this.chatService.sendMessage(message, forced);
    }

    observeChat(callback: (message: IChatMessage) => void) {
        return this.chatObserver.events.on('message', callback);
    }
}
