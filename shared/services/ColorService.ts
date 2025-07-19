import { Service } from 'typedi';

@Service()
export class ColorService {
    rgbToHex(r: number, g: number, b: number): `#${string}` {
        if (r > 255 || g > 255 || b > 255) return '#ffffff';

        // eslint-disable-next-line no-bitwise
        const hexColor = ((r << 16) | (g << 8) | b).toString(16);

        return `#${hexColor.padEnd(6, '0').toLowerCase()}`;
    }

    getColorsSimilarity(color1: string, color2: string) {
        const c1 = color1.replace('#', '');
        const r1 = parseInt(c1.substring(0, 2), 16);
        const g1 = parseInt(c1.substring(2, 4), 16);
        const b1 = parseInt(c1.substring(4, 6), 16);

        const c2 = color2.replace('#', '');
        const r2 = parseInt(c2.substring(0, 2), 16);
        const g2 = parseInt(c2.substring(2, 4), 16);
        const b2 = parseInt(c2.substring(4, 6), 16);

        let r = 255 - Math.abs(r1 - r2);
        let g = 255 - Math.abs(g1 - g2);
        let b = 255 - Math.abs(b1 - b2);

        r /= 255;
        g /= 255;
        b /= 255;

        return (r + g + b) / 3;
    }
}
