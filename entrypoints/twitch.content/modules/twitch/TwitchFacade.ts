import { Container, ContainerInstance } from 'typedi';
import { BasicFacade } from '@components/shared/BasicFacade';
import { TwitchElementsRegistry } from './services';

export class TwitchFacade extends BasicFacade {
    static container = Container.of('twitch');

    static providers = [
        TwitchElementsRegistry
    ];

    private readonly elementsRegistry!: TwitchElementsRegistry;

    constructor(container: ContainerInstance) {
        super();

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

    get chatButtonsContainerEl() {
        return this.elementsRegistry.chatButtonsContainerEl;
    }

    get chatScrollableAreaEl() {
        return this.elementsRegistry.chatScrollableAreaEl;
    }

    get isAdsPhase() {
        return this.elementsRegistry.isAdsPhase;
    }

    init(callback: () => void) {
        this.elementsRegistry.onElementsReady(() => {
            // this.enableAdsVideoResizer();
            callback();
        });
    }

    private enableAdsVideoResizer() {
        // this.adsVideoResizerService.enableResize();
    }
}
