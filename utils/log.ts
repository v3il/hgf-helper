import { isDev } from '@shared/consts';

export const log = (message: any) => {
    const time = new Date().toLocaleTimeString();
    console.log(`HGF Helper, ${time}:`, message);
};

export const logDev = (message: any) => {
    if (isDev) {
        log(message);
    }
};
