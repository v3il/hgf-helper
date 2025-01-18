export class TwitchUser {
    static create(userName: string) {
        return new TwitchUser(userName);
    }

    constructor(readonly userName: string) {}

    isCurrentUser(name: string) {
        return this.userName === name;
    }
}
