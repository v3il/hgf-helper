export class TwitchUser {
    static create(options) {
        return new TwitchUser(options);
    }

    #id;
    #userName;
    #inactiveHours;

    constructor({ id, name, inactiveHours }) {
        this.#id = id;
        this.#userName = name;
        this.#inactiveHours = inactiveHours;
    }
}
