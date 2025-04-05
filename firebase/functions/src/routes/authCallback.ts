import { defineSecret } from 'firebase-functions/params';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { logger } from 'firebase-functions';
import { AUTH_REDIRECT_URI, AUTH_SUCCESS_URL } from '../appUrls';
import { IUserData } from '../types';
import { usersService } from '../services';

const twitchClientId = defineSecret('TWITCH_CLIENT_ID');
const twitchClientSecret = defineSecret('TWITCH_CLIENT_SECRET');
const jwtSecret = defineSecret('JWT_SECRET');

export const authCallback = async (request: Request, response: Response) => {
    const { code } = request.query;

    if (!code) {
        response.status(400).send({ error: 'No code provided' });
        return;
    }

    try {
        const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                code: code.toString(),
                client_id: twitchClientId.value(),
                client_secret: twitchClientSecret.value(),
                grant_type: 'authorization_code',
                redirect_uri: AUTH_REDIRECT_URI
            })
        });

        const data = await tokenResponse.json();

        const userResponse = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': twitchClientId.value(),
                Authorization: `Bearer ${data.access_token}`
            }
        });

        const userData = await userResponse.json();
        const userId = userData.data[0].id;
        const userName = userData.data[0].display_name;

        await usersService.createIfNotExists(userId, userName);

        const payload: IUserData = { userId, userName, rnd: Math.random() };
        const token = sign(payload, jwtSecret.value(), { expiresIn: '180d' });

        logger.info(`User ${userId} authenticated`);

        response.redirect(`${AUTH_SUCCESS_URL}?token=${token}`);
    } catch (error) {
        logger.error(error);
        response.status(500).send('Error authenticating with Twitch');
    }
};
