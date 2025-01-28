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

    get currentGame() {
        return this.#elementsRegistry.currentGame;
    }

    get activeVideoEl() {
        return this.#elementsRegistry.activeVideoEl;
    }

    get chatScrollableAreaEl() {
        return this.#elementsRegistry.chatScrollableAreaEl;
    }

    init(callback: () => void) {
        this.#elementsRegistry.onElementsReady(async () => {
            await this.#initUser();
            this.#enableChannelPointsClaimer();
            callback();
        });
    }

    #enableChannelPointsClaimer() {
        this.#channelPointsClaimerService.enableAutoClaim();
    }

    async #initUser() {
        const userName = await this.#elementsRegistry.getUserName();
        this.#userService.initUser({ userName });
    }
}
