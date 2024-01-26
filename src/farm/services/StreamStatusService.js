import { Container } from 'typedi';
import { ColorService } from './ColorService';
import { InjectionTokens, antiCheatChecks } from '../consts';

export class StreamStatusService {
    static create() {
        const canvasView = Container.get(InjectionTokens.STREAM_STATUS_CANVAS);

        return new StreamStatusService({ canvasView });
    }

    #canvasView;
    #isAntiCheatScreen = false;

    constructor({ canvasView }) {
        this.#canvasView = canvasView;
    }

    checkStreamStatus() {
        this.#isAntiCheatScreen = this.#isAntiCheat();
    }

    #isAntiCheat() {
        const { canvasEl } = this.#canvasView;
        const { width, height } = canvasEl;

        const checksResults = antiCheatChecks.map(({ xPercent, yPercent, color }) => {
            const x = Math.floor((xPercent * width) / 100);
            const y = Math.floor((yPercent * height) / 100);

            const context = canvasEl.getContext('2d', { willReadFrequently: true });
            const [r, g, b] = context.getImageData(x, y, 1, 1).data;
            const pixelHexColor = ColorService.rgbToHex(r, g, b);

            return {
                expected: color,
                actual: pixelHexColor,
                similarity: ColorService.getColorsSimilarity(color, pixelHexColor)
            };
        });

        const failedChecks = checksResults.filter(({ similarity, actual }) => {
            const isBlack = actual === '000000';
            return isBlack ? true : similarity >= 0.85;
        });

        const date = new Date().toLocaleString();
        const isAntiCheat = (failedChecks.length / antiCheatChecks.length) >= 0.5;
        const method = isAntiCheat ? 'error' : 'info';

        console[method](`[${date}] ${failedChecks.length} / ${antiCheatChecks.length}`);

        return isAntiCheat;
    }

    get isBanPhase() {
        return this.#isAntiCheatScreen;
    }

    forceBanPhase() {
        this.#isAntiCheatScreen = true;
    }
}
