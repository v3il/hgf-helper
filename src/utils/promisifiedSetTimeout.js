export const promisifiedSetTimeout = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}
