import { Request, Response } from 'express';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../db';

export const test = async (request: Request, response: Response) => {
    await setDoc(doc(db, 'users', 'user123'), {
        settings: { theme: 'dark', notifications: true },
        products: ['apple', 'banana']
    });

    console.log('Тестові дані додано2!');

    response.sendStatus(200);
};
