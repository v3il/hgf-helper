import { Container, ContainerInstance } from 'typedi';
import { BasicFacade } from '@components/shared/BasicFacade';
import { ChannelPointsClaimerService, TwitchElementsRegistry } from './services';

export class TwitchFacade extends BasicFacade {
    static container = Container.of('twitch');

    static providers = [
        TwitchElementsRegistry,
        ChannelPointsClaimerService
    ];

    private readonly channelPointsClaimerService!: ChannelPointsClaimerService;
    private readonly elementsRegistry!: TwitchElementsRegistry;

    constructor(container: ContainerInstance) {
        super();

        this.channelPointsClaimerService = container.get(ChannelPointsClaimerService);
        this.elementsRegistry = container.get(TwitchElementsRegistry);
    }

    static get instance(): TwitchFacade {
        return super.instance;
    }

    get twitchUserName() {
        return this.elementsRegistry.twitchUserName;
    }

    get currentGame() {
        return this.elementsRegistry.currentGame;
    }

    get activeVideoEl() {
        return this.elementsRegistry.activeVideoEl;
    }

    get chatScrollableAreaEl() {
        return this.elementsRegistry.chatScrollableAreaEl;
    }

    get isAdsPhase() {
        return this.elementsRegistry.isAdsPhase;
    }

    init(callback: () => void) {
        this.elementsRegistry.onElementsReady(() => {
            this.enableChannelPointsClaimer();
            // this.enableAdsVideoResizer();
            callback();
        });
    }

    private enableChannelPointsClaimer() {
        this.channelPointsClaimerService.enableAutoClaim();
    }

    private enableAdsVideoResizer() {
        // this.adsVideoResizerService.enableResize();
    }
}
