import { ColorService } from '../../../shared';
import { antiCheatChecks } from '../../../../consts';
import './style.css';
import template from './template.html?raw';

export class StreamStatusService {
    #isVideoBroken = false;
    #isAntiCheatScreen = false;
    #el;
    #canvasEl;

    constructor() {
        this.#el = this.#createElement();
        this.#canvasEl = this.#el.querySelector('[data-canvas]');

        document.body.appendChild(this.#el);
    }

    checkStreamStatus(activeVideoEl) {
        this.#isAntiCheatScreen = false;
        this.#isVideoBroken = false;

        if (!activeVideoEl || activeVideoEl.paused || activeVideoEl.ended) {
            this.#isVideoBroken = true;
            this.#log('Video is broken', 'warn');
            return;
        }

        this.#renderVideoFrame(activeVideoEl);
        this.#isAntiCheatScreen = this.#isAntiCheat();
    }

    #renderVideoFrame(videoEl) {
        this.#canvasEl.width = videoEl.clientWidth;
        this.#canvasEl.height = videoEl.clientHeight;

        const ctx = this.#canvasEl.getContext('2d');

        ctx.drawImage(videoEl, 0, 0, this.#canvasEl.width, this.#canvasEl.height);
    }

    #createElement() {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild;
    }

    #isAntiCheat() {
        const { width, height } = this.#canvasEl;

        const checksResults = antiCheatChecks.map(({ xPercent, yPercent, color }) => {
            const x = Math.floor((xPercent * width) / 100);
            const y = Math.floor((yPercent * height) / 100);

            const context = this.#canvasEl.getContext('2d', { willReadFrequently: true });
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

        const isAntiCheat = (failedChecks.length / antiCheatChecks.length) >= 0.5;

        this.#log(`${failedChecks.length} / ${antiCheatChecks.length}`, isAntiCheat ? 'error' : 'info');

        return isAntiCheat;
    }

    #log(message, type) {
        const date = new Date().toLocaleString();
        console[type](`[${date}]: ${message}`);
    }

    get isVideoBroken() {
        return this.#isVideoBroken;
    }

    get isAntiCheatScreen() {
        return this.#isAntiCheatScreen;
    }

    get isAllowedToSendMessage() {
        return !this.#isVideoBroken && !this.#isAntiCheatScreen;
    }
}
