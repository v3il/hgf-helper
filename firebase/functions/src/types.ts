export interface IUserData {
    userId: string;
    userName: string,
    rnd: number
}

declare module 'express' {
    interface Request {
        user?: IUserData;
    }
}
