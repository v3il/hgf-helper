export interface IUserData {
    id: string;
}

declare module 'express' {
    interface Request {
        user?: IUserData;
    }
}
