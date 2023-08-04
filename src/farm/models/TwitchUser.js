export class TwitchUser {
    static create(options) {
        return new TwitchUser(options);
    }

    #id;
    #userName;
    #minigameHours;

    constructor({ id, name, minigameHours }) {
        this.#id = id;
        this.#userName = name;
        this.#minigameHours = minigameHours;
    }

    isCurrentUser(name) {
        return this.#userName === name;
    }
}
