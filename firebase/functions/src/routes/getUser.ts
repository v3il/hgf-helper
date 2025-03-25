import { Request, Response } from 'express';
import { usersService } from '../services';

export const getUser = async (request: Request, response: Response) => {
    try {
        const user = await usersService.get(request.user!.id);

        if (!user) {
            response.status(404).send({ error: 'User not found' });
            return;
        }

        response.send({ user });
    } catch (error) {
        console.error('Get user error', error);
        response.status(500).send({ error: 'Internal server error' });
    }
};
