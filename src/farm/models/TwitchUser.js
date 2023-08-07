export class TwitchUser {
    static create(userName) {
        return new TwitchUser(userName);
    }

    #userName;

    constructor(userName) {
        this.#userName = userName;
    }

    isCurrentUser(name) {
        return this.#userName === name;
    }
}
