import { Request, Response } from 'express';

export const authSuccess = async (request: Request, response: Response) => {
    response.sendStatus(200);
};
