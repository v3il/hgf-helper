import { BasicFacade } from '@components/shared/BasicFacade';
import { Container, ContainerInstance } from 'typedi';
import { TwitchFacade } from '@farm/modules/twitch';
import { IChatMessage, TwitchChatObserver, TwitchChatService } from './services';

export class ChatFacade extends BasicFacade {
    static container = Container.of('chat');

    static providers = [
        TwitchFacade,
        TwitchChatService,
        TwitchChatObserver
    ];

    private readonly chatObserver: TwitchChatObserver;
    private readonly chatService: TwitchChatService;

    constructor(container: ContainerInstance) {
        super();

        this.chatObserver = container.get(TwitchChatObserver);
        this.chatService = container.get(TwitchChatService);
    }

    static get instance(): ChatFacade {
        return super.instance;
    }

    sendMessage(message: string) {
        this.chatService.sendMessage(message);
    }

    observeChat(callback: (message: IChatMessage) => void) {
        return this.chatObserver.events.on('message', (message) => callback(message!));
    }
}
