export function generateDelay(min: number, max: number) {
    return min + Math.floor(Math.random() * (max - min));
}
