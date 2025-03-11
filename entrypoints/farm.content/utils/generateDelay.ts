export function getRandomNumber(min: number, max: number) {
    return min + Math.floor(Math.random() * (max - min));
}

/** @deprecated */
export function generateDelay(min: number, max: number) {
    return getRandomNumber(min, max);
}
