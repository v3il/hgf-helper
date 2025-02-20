import { TwitchElementsRegistry, ChannelPointsClaimerService } from './services';

interface ITwitchFacadeParams {
    twitchElementsRegistry: TwitchElementsRegistry;
    channelPointsClaimerService: ChannelPointsClaimerService;
}

export class TwitchFacade {
    static _instance: TwitchFacade;

    static get instance() {
        if (!this._instance) {
            const twitchElementsRegistry = new TwitchElementsRegistry();
            const channelPointsClaimerService = new ChannelPointsClaimerService({ twitchElementsRegistry });

            this._instance = new TwitchFacade({
                twitchElementsRegistry,
                channelPointsClaimerService
            });
        }

        return this._instance;
    }

    private readonly elementsRegistry;
    private readonly channelPointsClaimerService;

    constructor({ twitchElementsRegistry, channelPointsClaimerService }: ITwitchFacadeParams) {
        this.elementsRegistry = twitchElementsRegistry;
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
            console.error(this.twitchUserName);
            this.#enableChannelPointsClaimer();
            callback();
        });
    }

    #enableChannelPointsClaimer() {
        this.channelPointsClaimerService.enableAutoClaim();
    }
}
