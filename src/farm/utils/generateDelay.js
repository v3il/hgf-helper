import { Timing } from '../consts';

export function generateDelay(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

export function generateMiniGameDelay() {
    const basePart = 10 * Timing.SECOND;
    const randomPart = generateDelay(30 * Timing.SECOND, 5 * Timing.MINUTE);

    console.error((basePart + randomPart) / Timing.MINUTE);

    return basePart + randomPart;
}
