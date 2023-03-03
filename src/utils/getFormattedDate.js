const formatNumber = (number) => (number < 10 ? `0${number}` : number);

export const getFormattedDate = () => {
    const now = new Date();
    return `${formatNumber(now.getHours())}:${formatNumber(now.getMinutes())}:${formatNumber(now.getSeconds())}`;
};
