import { promisifiedSetTimeout } from '../utils/promisifiedSetTimeout';

export class WaiterService {
    static create({ twitchUser }) {
        return new WaiterService({ twitchUser });
    }

    #twitchUser;

    constructor({ twitchUser }) {
        this.#twitchUser = twitchUser;
    }

    async wait(baseDelay) {
        const bonusDelay = this.#twitchUser.isPrimaryUser ? 0 : baseDelay * 0.5;

        console.error('wait', baseDelay + bonusDelay);

        await promisifiedSetTimeout(baseDelay + bonusDelay);
    }
}
