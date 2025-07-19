import { isDev } from '@shared/consts';

const getPrefix = () => {
    const time = new Date().toLocaleTimeString();
    return `HGF Helper, ${time}:`;
}

export const log = (...messages: any) => {
    console.log(getPrefix(), ...messages);
};

export const logError = (...messages: any) => {
    console.error(getPrefix(), ...messages);
}

export const logTable = (data: any[]) => {
    log();
    console.table(data);
}

export const clearLog = () => {
    console.clear();
};

export const logDev = (...messages: any) => {
    if (isDev) {
        log(...messages);
    }
};
