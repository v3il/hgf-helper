import { Timing } from '../consts';

export function generateDelay(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

export function generateMiniGameDelay() {
    return generateDelay(10 * Timing.SECOND, 30 * Timing.SECOND);
}
