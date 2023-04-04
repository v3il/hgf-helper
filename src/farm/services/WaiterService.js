import { promisifiedSetTimeout } from '../utils/promisifiedSetTimeout';

export class WaiterService {
    static create({ twitchUser }) {
        return new WaiterService({ twitchUser });
    }

    #twitchUser;

    constructor({ twitchUser }) {
        this.#twitchUser = twitchUser;
    }

    async wait(baseDelay, delta = 0) {
        const bonusDelay = this.#twitchUser.isPrimaryUser ? 0 : baseDelay * 0.5;
        const deltaDelay = Math.random() * delta;

        await promisifiedSetTimeout(baseDelay + bonusDelay + deltaDelay);
    }
}
