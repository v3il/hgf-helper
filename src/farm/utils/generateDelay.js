import { Timing } from '../consts';

export function generateDelay(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

export function generateMiniGameDelay() {
    return generateDelay(10 * Timing.SECOND, 2 * Timing.MINUTE);
}
