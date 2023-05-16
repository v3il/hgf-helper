import { Timing } from '../consts';

export function generateDelay(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

export function generateMiniGameDelay() {
    const basePart = 10 * Timing.SECOND;
    const randomPart = generateDelay(10 * Timing.SECOND, 4 * Timing.MINUTE);

    console.error('Mini games', basePart + randomPart, Math.floor((basePart + randomPart) / 60));

    return basePart + randomPart;
}

export function generateHitsquadDelay() {
    const basePart = Timing.MINUTE;
    const randomPart = generateDelay(10 * Timing.SECOND, 10 * Timing.MINUTE);

    console.error('Hitsquad', basePart + randomPart, Math.floor((basePart + randomPart) / 60));

    return basePart + randomPart;
}
