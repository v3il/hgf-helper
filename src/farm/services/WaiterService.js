import { promisifiedSetTimeout } from '../utils/promisifiedSetTimeout';

export class WaiterService {
    static create({ twitchUser }) {
        return new WaiterService({ twitchUser });
    }

    #twitchUser;

    constructor({ twitchUser }) {
        this.#twitchUser = twitchUser;
    }

    async wait(baseDelay, randomPart = 0) {
        const bonusDelay = this.#twitchUser.isPrimaryUser ? 0 : baseDelay * 0.5;
        const randomDelay = Math.random() * randomPart;

        await promisifiedSetTimeout(baseDelay + bonusDelay + randomDelay);
    }
}
