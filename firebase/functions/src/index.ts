import express from 'express';
import cors from 'cors';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import {
    auth, authCallback, authSuccess, getUser, updateUser
} from './routes';
import { authorized } from './middlewares';
import { usersService } from './services';
import { initFirestore } from './db';

initializeApp();

const firestore = initFirestore();
usersService.setFirestore(firestore);

const app = express();

app.use(cors({
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/auth', auth);
app.get('/auth/callback', authCallback);
app.get('/auth/success', authSuccess);
app.get('/user', authorized, getUser);
app.patch('/user', authorized, updateUser);

const twitchClientId = defineSecret('TWITCH_CLIENT_ID');
const twitchClientSecret = defineSecret('TWITCH_CLIENT_SECRET');
const jwtSecret = defineSecret('JWT_SECRET');

export const twitchAuth = onRequest({
    secrets: [twitchClientId, twitchClientSecret, jwtSecret]
}, app);
