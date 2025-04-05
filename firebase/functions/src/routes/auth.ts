import { defineSecret } from 'firebase-functions/params';
import { Request, Response } from 'express';
import { AUTH_REDIRECT_URI } from '../appUrls';

const twitchClientId = defineSecret('TWITCH_CLIENT_ID');

export const auth = (_: Request, response: Response) => {
    const clientId = twitchClientId.value();
    const scope = 'user:read:email';

    // eslint-disable-next-line max-len
    response.redirect(`https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${AUTH_REDIRECT_URI}&response_type=code&scope=${scope}`);
};
