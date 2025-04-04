// @ts-nocheck
export const debounce = (callback: () => void, timeout: number) => {
    let timer: number;

    return (...args: Parameters<any>) => {
        clearTimeout(timer);
        timer = setTimeout(() => { callback.apply(this, args); }, timeout);
    };
};
