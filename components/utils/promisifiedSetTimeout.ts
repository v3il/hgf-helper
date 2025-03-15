export const promisifiedSetTimeout = (timeout: number) => new Promise((resolve) => {
    setTimeout(resolve, timeout);
});
