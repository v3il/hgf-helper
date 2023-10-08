import { Timing } from '../consts';

export function generateDelay(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

export function generateMiniGameDelay() {
    return generateDelay(Timing.MINUTE, 2.5 * Timing.MINUTE);
}
