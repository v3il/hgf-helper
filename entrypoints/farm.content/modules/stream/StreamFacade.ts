import { OnScreenTextRecognizer } from '@components/shared';
import { BasicFacade } from '@components/shared/BasicFacade';
import { Container, ContainerInstance } from 'typedi';
import { ChatFacade } from '@farm/modules/chat';
import { TwitchFacade } from '@farm/modules/twitch';
import { StreamStatusService, TwitchPlayerService } from './services';

export class StreamFacade extends BasicFacade {
    static container = Container.of('stream');

    static providers = [
        TwitchFacade,
        ChatFacade,
        OnScreenTextRecognizer,
        StreamStatusService,
        TwitchPlayerService
    ];

    private readonly streamStatusService!: StreamStatusService;
    private readonly twitchPlayerService!: TwitchPlayerService;

    constructor(container: ContainerInstance) {
        super();

        this.streamStatusService = container.get(StreamStatusService);
        this.twitchPlayerService = container.get(TwitchPlayerService);
    }

    static get instance(): StreamFacade {
        return super.instance;
    }

    get streamService() {
        return this.streamStatusService;
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

    checkStreamStatus() {
        this.streamStatusService.checkStreamStatus();
    }

    decreaseVideoDelay() {
        this.twitchPlayerService.decreaseVideoDelay();
    }
}
