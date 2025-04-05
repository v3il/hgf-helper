import { Request, Response } from 'express';
import { usersService } from '../services';

export const updateUser = async (request: Request, response: Response) => {
    const { body } = request;

    try {
        const user = await usersService.get(request.user!.userId);

        console.error('User', user);

        if (!user) {
            response.sendStatus(404);
            return;
        }

        await usersService.update(request.user!.userId, body);
        response.sendStatus(200);
    } catch (error) {
        console.error('Update user error', error);
        response.status(401).send({ error: 'Bad request' });
    }
};
