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
}
