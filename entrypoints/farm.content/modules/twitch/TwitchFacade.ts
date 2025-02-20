import { TwitchElementsRegistry, ChannelPointsClaimerService, AdsVideoResizerService } from './services';

interface ITwitchFacadeParams {
    twitchElementsRegistry: TwitchElementsRegistry;
    adsVideoResizerService: AdsVideoResizerService;
    channelPointsClaimerService: ChannelPointsClaimerService;
}

export class TwitchFacade {
    static _instance: TwitchFacade;

    static get instance() {
        if (!this._instance) {
            const twitchElementsRegistry = new TwitchElementsRegistry();
            const adsVideoResizerService = new AdsVideoResizerService({ twitchElementsRegistry });
            const channelPointsClaimerService = new ChannelPointsClaimerService({ twitchElementsRegistry });

            this._instance = new TwitchFacade({
                twitchElementsRegistry,
                adsVideoResizerService,
                channelPointsClaimerService
            });
        }

        return this._instance;
    }

    private readonly elementsRegistry;
    private readonly channelPointsClaimerService;
    private readonly adsVideoResizerService;

    constructor({ twitchElementsRegistry, channelPointsClaimerService, adsVideoResizerService }: ITwitchFacadeParams) {
        this.elementsRegistry = twitchElementsRegistry;
        this.adsVideoResizerService = adsVideoResizerService;
        this.channelPointsClaimerService = channelPointsClaimerService;
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

    init(callback: () => void) {
        this.elementsRegistry.onElementsReady(() => {
            this.enableChannelPointsClaimer();
            this.enableAdsVideoResizer();
            callback();
        });
    }

    private enableChannelPointsClaimer() {
        this.channelPointsClaimerService.enableAutoClaim();
    }

    private enableAdsVideoResizer() {
        this.adsVideoResizerService.enableResize();
    }
}
