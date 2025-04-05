export const waitAsync = (timeout: number) => new Promise((resolve) => {
    setTimeout(resolve, timeout);
});
