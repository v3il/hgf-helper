export class ColorService {
    static rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255) return 'FFFFFF';

        // eslint-disable-next-line no-bitwise
        const hexColor = ((r << 16) | (g << 8) | b).toString(16);

        return hexColor.padEnd(6, '0');
    }

    static getColorsSimilarity(color1, color2) {
        const r1 = parseInt(color1.substring(0, 2), 16);
        const g1 = parseInt(color1.substring(2, 4), 16);
        const b1 = parseInt(color1.substring(4, 6), 16);

        const r2 = parseInt(color2.substring(0, 2), 16);
        const g2 = parseInt(color2.substring(2, 4), 16);
        const b2 = parseInt(color2.substring(4, 6), 16);

        let r = 255 - Math.abs(r1 - r2);
        let g = 255 - Math.abs(g1 - g2);
        let b = 255 - Math.abs(b1 - b2);

        r /= 255;
        g /= 255;
        b /= 255;

        return (r + g + b) / 3;
    }
}
