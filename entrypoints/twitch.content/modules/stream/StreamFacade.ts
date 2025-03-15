import { OnScreenTextRecognizer } from '@components/services';
import { BasicFacade } from '@components/BasicFacade';
import { Container, ContainerInstance } from 'typedi';
import { StreamStatusService, TwitchPlayerService } from './services';

export class StreamFacade extends BasicFacade {
    static container = Container.of('stream');

    static providers = [
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
