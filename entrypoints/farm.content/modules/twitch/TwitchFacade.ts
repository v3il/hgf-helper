import { TwitchElementsRegistry, UserService, ChannelPointsClaimerService } from './services';

interface ITwitchFacadeParams {
    twitchElementsRegistry: TwitchElementsRegistry;
    userService: UserService;
    channelPointsClaimerService: ChannelPointsClaimerService;
}

export class TwitchFacade {
    static _instance: TwitchFacade;

    static get instance() {
        if (!this._instance) {
            const twitchElementsRegistry = new TwitchElementsRegistry();
            const userService = new UserService();
            const channelPointsClaimerService = new ChannelPointsClaimerService({ twitchElementsRegistry });

            this._instance = new TwitchFacade({
                twitchElementsRegistry,
                userService,
                channelPointsClaimerService
            });
        }

        return this._instance;
    }

    #elementsRegistry;
    #userService;
    #channelPointsClaimerService;

    constructor({ twitchElementsRegistry, userService, channelPointsClaimerService }: ITwitchFacadeParams) {
        this.#elementsRegistry = twitchElementsRegistry;
        this.#userService = userService;
        this.#channelPointsClaimerService = channelPointsClaimerService;
    }

    get twitchUser() {
        return this.#userService.twitchUser;
    }

    get gameName() {
        return this.#elementsRegistry.gameName;
    }

    get activeVideoEl() {
        return this.#elementsRegistry.activeVideoEl;
    }

    get chatScrollableAreaEl() {
        return this.#elementsRegistry.chatScrollableAreaEl;
    }

    init(callback: () => void) {
        this.#elementsRegistry.onElementsReady(() => {
            this.#initUser();
            this.#enableChannelPointsClaimer();
            callback();
        });
    }

    #enableChannelPointsClaimer() {
        this.#channelPointsClaimerService.enableAutoClaim();
    }

    #initUser() {
        const userName = this.#elementsRegistry.getUserName();
        this.#userService.initUser({ userName });
    }
}
