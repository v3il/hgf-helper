import { promisifiedSetTimeout } from '../utils';

export class WaiterService {
    static create({ twitchUser }) {
        return new WaiterService({ twitchUser });
    }

    static instance;
    #twitchUser;

    constructor({ twitchUser }) {
        if (WaiterService.instance) {
            // eslint-disable-next-line no-constructor-return
            return WaiterService.instance;
        }

        this.#twitchUser = twitchUser;
        WaiterService.instance = this;
    }

    async wait(baseDelay, randomPart = 0) {
        const bonusDelay = this.#twitchUser.isPrimaryUser ? 0 : baseDelay * 0.5;
        const randomDelay = Math.random() * randomPart;

        await promisifiedSetTimeout(baseDelay + bonusDelay + randomDelay);
    }

    async waitFixedTime(delay) {
        await promisifiedSetTimeout(delay);
    }
}
