import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import admin from 'firebase-admin';
import { auth, authCallback, test } from './routes';

if (!admin.apps.length) {
    admin.initializeApp();
}

const app = express();

app.get('/auth', auth);
app.get('/auth/callback', authCallback);
app.get('/test', test);

const twitchClientId = defineSecret('TWITCH_CLIENT_ID');
const twitchClientSecret = defineSecret('TWITCH_CLIENT_SECRET');
const jwtSecret = defineSecret('JWT_SECRET');

export const twitchAuth = onRequest({
    secrets: [twitchClientId, twitchClientSecret, jwtSecret]
}, app);
