import { TwitchElementsRegistry, UserService, ChannelPointsClaimerService } from './services';
import { BasicFacade } from '../../BasicFacade';

export class TwitchFacade extends BasicFacade {
    static providers = [
        { id: TwitchElementsRegistry, type: TwitchElementsRegistry },
        { id: ChannelPointsClaimerService, type: ChannelPointsClaimerService },
        { id: UserService, type: UserService }
    ];

    #elementsRegistry;
    #userService;
    #channelPointsClaimerService;

    constructor(container) {
        super();

        this.#elementsRegistry = container.get(TwitchElementsRegistry);
        this.#userService = container.get(UserService);
        this.#channelPointsClaimerService = container.get(ChannelPointsClaimerService);
    }

    get twitchUser() {
        return this.#userService.twitchUser;
    }

    init(callback) {
        this.#elementsRegistry.onElementsReady(() => {
            this.#initUser();
            callback();
        });
    }

    enableChannelPointsClaimer() {
        this.#channelPointsClaimerService.enableAutoClaim();
    }

    #initUser() {
        const userName = this.#elementsRegistry.getUserName();
        this.#userService.initUser({ userName });
    }
}