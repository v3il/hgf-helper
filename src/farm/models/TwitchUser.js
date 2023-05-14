import { Timing } from '../consts';
import { generateDelay } from '../utils';

export class TwitchUser {
    static create(options) {
        return new TwitchUser(options);
    }

    #id;
    #userName;

    constructor({ id, name }) {
        this.#id = id;
        this.#userName = name;
    }

    isCurrentUser(userName) {
        return userName === this.#userName;
    }

    getMiniGamesDelay() {
        const basePart = 10 * Timing.SECOND;
        const randomPart = generateDelay((this.#id - 1) * 30 * Timing.SECOND, this.#id * 30 * Timing.SECOND);

        return basePart + randomPart;
    }

    getHitsquadDelay() {
        const basePart = Timing.MINUTE;
        const randomPart = generateDelay((this.#id - 1) * 30 * Timing.SECOND, this.#id * 30 * Timing.SECOND);

        return basePart + randomPart;
    }
}
