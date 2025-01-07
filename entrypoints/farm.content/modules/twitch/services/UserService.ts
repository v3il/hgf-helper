import { TwitchUser } from '../models';

export class UserService {
    twitchUser!: TwitchUser;

    initUser({ userName }: {userName: string}) {
        this.twitchUser = TwitchUser.create(userName);
    }
}
