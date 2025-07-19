import { Request, Response } from 'express';
import { logger } from 'firebase-functions';
import { usersService } from '../services';

export const getUser = async (request: Request, response: Response) => {
    try {
        const extensionVersion = request.headers['hgf-client-version'] as string || '2.0.0';
        const user = await usersService.get(request.user!.userId);

        if (!user) {
            response.status(404).send({ error: 'User not found' });
            return;
        }

        await usersService.update(request.user!.userId, {
            extensionVersion
        });

        response.send({ user });
    } catch (error) {
        logger.error('Get user error', error);
        response.status(500).send({ error: 'Internal server error' });
    }
};
