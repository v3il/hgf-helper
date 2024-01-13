import { Container } from 'typedi';
import { ColorService } from './ColorService';
import { EventEmitter } from '../models/EventsEmitter';
import { InjectionTokens, Timing, antiCheatChecks } from '../consts';
import { promisifiedSetTimeout } from '../utils';

export class StreamStatusService {
    static create({ canvasView }) {
        const twitchPlayerService = Container.get(InjectionTokens.PLAYER_SERVICE);

        return new StreamStatusService({
            canvasView,
            twitchPlayerService,
            events: EventEmitter.create()
        });
    }

    #canvasView;
    #events;
    #twitchPlayerService;
    #isBan = false;
    #isChecksRunning = false;

    constructor({ canvasView, twitchPlayerService, events }) {
        this.#canvasView = canvasView;
        this.#events = events;
        this.#twitchPlayerService = twitchPlayerService;

        // this.#checkBanPhase(1);

        // setInterval(async () => {
        //     await this.#checkBanPhase(3);
        //     await twitchPlayerService.decreaseVideoDelay();
        // }, 35 * Timing.SECOND);
    }

    get events() {
        return this.#events;
    }

    async checkStreamStatus(checksCount) {
        await this.#checkBanPhase(checksCount);
    }

    #getActiveVideoEl() {
        const isAdsPhase = !!document.querySelector('[data-a-target="video-ad-countdown"]');
        const [mainVideoEl, alternativeVideoEl] = document.querySelectorAll('video');

        if (isAdsPhase && !alternativeVideoEl) {
            return null;
        }

        return isAdsPhase ? alternativeVideoEl : mainVideoEl;
    }

    async #checkBanPhase(checksCount) {
        this.#isBan = true;
        this.#isChecksRunning = true;
        this.#events.emit('check');

        console.error('-----------------------------');
        console.error('Checks started');

        for (let i = 0; i < checksCount; i++) {
            console.error(`Check #${i + 1}:`);

            if (this.#isAntiCheat()) {
                this.#isChecksRunning = false;
                return this.#events.emit('check');
            }

            await promisifiedSetTimeout(3 * Timing.SECOND);
        }

        console.error('Checks finished');

        this.#isBan = false;
        this.#isChecksRunning = false;
        this.#events.emit('check');
    }

    renderVideoFrame() {
        const videoEl = this.#getActiveVideoEl();
        this.#canvasView.renderVideoFrame(videoEl);
    }

    #isAntiCheat() {
        const videoEl = this.#getActiveVideoEl();

        // Some problems with video
        if (!videoEl) {
            console.error('video element not found');
            return true;
        }

        // Stream went offline
        if (videoEl.paused || videoEl.ended) {
            console.error('stream went offline');
            return true;
        }

        this.#canvasView.renderVideoFrame(videoEl);

        const canvas = this.#canvasView.canvasEl;
        const { width, height } = canvas;

        const checksResults = antiCheatChecks.map(({ xPercent, yPercent, color }) => {
            const x = Math.floor((xPercent * width) / 100);
            const y = Math.floor((yPercent * height) / 100);

            const context = canvas.getContext('2d', { willReadFrequently: true });
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

    get isChecksRunning() {
        return this.#isChecksRunning;
    }
}
