import { Request, Response } from 'express';
import { usersService } from '../services';

export const updateUser = async (request: Request, response: Response) => {
    const { body } = request;

    try {
        await usersService.update(request.user!.id, body);
        response.sendStatus(200);
    } catch (error) {
        console.error('Update user error', error);
        response.status(401).send({ error: 'Bad request' });
    }
};
