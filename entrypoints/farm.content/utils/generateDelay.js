export function generateDelay(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}
