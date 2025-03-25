import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { defineSecret } from 'firebase-functions/params';
import { IUserData } from '../types';

const jwtSecret = defineSecret('JWT_SECRET');

export const authorized = (request: Request, response: Response, next: NextFunction) => {
    const { authorization } = request.headers;

    if (!authorization) {
        response.status(401).send({ error: 'Unauthorized' });
        return;
    }

    const [type, token] = authorization!.split(' ');

    if (!(token && type === 'Bearer')) {
        response.status(403).send({ error: 'Forbidden' });
        return;
    }

    try {
        request.user = verify(token, jwtSecret.value()) as IUserData;
        next();
    } catch (error) {
        response.status(401).send({ error: 'Unauthorized' });
    }
};
