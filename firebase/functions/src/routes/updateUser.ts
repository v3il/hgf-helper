import { Request, Response } from 'express';
import { usersService } from '../services';

export const updateUser = async (request: Request, response: Response) => {
    const { body } = request;

    try {
        const user = await usersService.get(request.user!.userId);

        console.error('User', user);

        if (!user) {
            response.status(404).send({ error: 'User not found' });
            return;
        }

        await usersService.update(request.user!.userId, body);
        response.send({});
    } catch (error) {
        console.error('Update user error', error);
        response.status(401).send({ error: 'Bad request' });
    }
};
