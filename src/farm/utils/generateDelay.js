import { Timing } from '../consts';

export function generateDelay(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

export function generateMiniGameDelay() {
    const basePart = Timing.MINUTE;
    const randomPart = generateDelay(10 * Timing.SECOND, 5 * Timing.MINUTE);

    return basePart + randomPart;
}
