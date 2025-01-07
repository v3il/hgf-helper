import { TwitchElementsRegistry, UserService, ChannelPointsClaimerService } from './services';

export class TwitchFacade {
    static _instance;

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

    constructor({ twitchElementsRegistry, userService, channelPointsClaimerService }) {
        this.#elementsRegistry = twitchElementsRegistry;
        this.#userService = userService;
        this.#channelPointsClaimerService = channelPointsClaimerService;
    }

    get twitchUser() {
        return this.#userService.twitchUser;
    }

    get activeVideoEl() {
        return this.#elementsRegistry.activeVideoEl;
    }

    get chatScrollableAreaEl() {
        return this.#elementsRegistry.chatScrollableAreaEl;
    }

    init(callback) {
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
