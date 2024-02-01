import { TwitchUser } from '../models';

export class UserService {
    #twitchUser;

    get twitchUser() {
        return this.#twitchUser;
    }

    initUser({ userName }) {
        this.#twitchUser = TwitchUser.create(userName);
    }
}
