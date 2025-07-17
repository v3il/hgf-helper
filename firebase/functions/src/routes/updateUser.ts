import { Request, Response } from 'express';
import { logger } from 'firebase-functions';
import { usersService } from '../services';

export const updateUser = async (request: Request, response: Response) => {
    const { body } = request;
    const extensionVersion = request.headers['hgf-client-version'] as string;

    try {
        const user = await usersService.get(request.user!.userId);

        if (!user) {
            response.status(404).send({ error: 'User not found' });
            return;
        }

        const result = await usersService.update(request.user!.userId, {
            ...body,
            extensionVersion
        });

        if (!result) {
            response.status(400).send({ error: 'Bad request' });
            return;
        }

        response.sendStatus(200);
    } catch (error) {
        logger.error('Update user error', error);
        response.status(400).send({ error: 'Bad request' });
    }
};
