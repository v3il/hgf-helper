export const promisifiedSetTimeout = (timeout) => new Promise((resolve) => {
    setTimeout(resolve, timeout);
});
