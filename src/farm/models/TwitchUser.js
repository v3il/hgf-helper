import { PRIMARY_USERNAME, SECONDARY_USERNAME } from '../farmConfig';
import { Timing } from '../consts';
import { generateDelay } from '../utils';

export class TwitchUser {
    static create({ id, userName }) {
        return new TwitchUser({ id, userName });
    }

    #id;
    #userName;

    constructor({ id, userName }) {
        this.#id = id;
        this.#userName = userName;
    }

    get isPrimaryUser() {
        return this.#userName === PRIMARY_USERNAME;
    }

    get isSecondaryUser() {
        return this.#userName === SECONDARY_USERNAME;
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
