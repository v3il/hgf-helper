import { PRIMARY_USERNAME, SECONDARY_USERNAME } from '../farmConfig';

export class TwitchUser {
    static create({ userName }) {
        return new TwitchUser({ userName });
    }

    #userName;

    constructor({ userName }) {
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
}
