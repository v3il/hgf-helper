import { isDev } from '@farm/consts';

export const log = (message: any) => {
    if (isDev) {
        const time = new Date().toLocaleTimeString();
        console.log(`HGF Helper, ${time}:`, message);
    }
};
