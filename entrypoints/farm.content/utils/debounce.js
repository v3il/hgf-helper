export const debounce = (callback, timeout) => {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { callback.apply(this, args); }, timeout);
    };
};
