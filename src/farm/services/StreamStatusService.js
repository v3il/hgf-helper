import { Container } from 'typedi';
import { ColorService } from './ColorService';
import { InjectionTokens, Timing, antiCheatChecks } from '../consts';
import { promisifiedSetTimeout } from '../utils';

export class StreamStatusService {
    static create() {
        const canvasView = Container.get(InjectionTokens.CANVAS_VIEW);

        return new StreamStatusService({ canvasView });
    }

    #canvasView;
    #isBan = false;

    constructor({ canvasView }) {
        this.#canvasView = canvasView;
    }

    async checkStreamStatus(checksCount) {
        await this.#checkBanPhase(checksCount);
    }

    async #checkBanPhase(checksCount) {
        this.#isBan = true;

        console.error('-----------------------------');
        console.error('Checks started');

        for (let i = 0; i < checksCount; i++) {
            console.error(`Check #${i + 1}:`);

            if (this.#isAntiCheat()) {
                return;
            }

            if (i !== checksCount - 1) {
                await promisifiedSetTimeout(3 * Timing.SECOND);
            }
        }

        console.error('Checks finished');

        this.#isBan = false;
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

        console.error(`${failedChecks.length} / ${antiCheatChecks.length}`);

        return failedChecks.length / antiCheatChecks.length >= 0.6;
    }

    get isBanPhase() {
        return this.#isBan;
    }

    forceBanPhase() {
        this.#isBan = true;
    }
}
