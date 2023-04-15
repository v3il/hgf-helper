import { ColorService } from './ColorService';
import { banPhaseChecks } from '../consts/banPhaseChecks';
import { EventEmitter } from '../models/EventsEmitter';

export class StreamStatusService {
    static create({ canvasContainerEl }) {
        return new StreamStatusService({
            canvasContainerEl,
            events: EventEmitter.create()
        });
    }

    #canvasContainerEl;
    #canvasEl;
    #lastCheckData;
    #events;
    #intervalId;

    constructor({ canvasContainerEl, events }) {
        this.#canvasContainerEl = canvasContainerEl;
        this.#events = events;

        this.#canvasEl = this.#createCanvas();
        this.#canvasContainerEl.appendChild(this.#canvasEl);

        this.checkBanPhase();

        this.#intervalId = setInterval(() => {
            this.checkBanPhase();
        }, 25000);

        // this.#listenEvents();
    }

    get events() {
        return this.#events;
    }

    #createCanvas() {
        return document.createElement('canvas');
    }

    #getActiveVideoEl() {
        const isAdsPhase = this.#isAdsPhase();
        const [mainVideoEl, alternativeVideoEl] = document.querySelectorAll('video');

        if (isAdsPhase && !alternativeVideoEl) {
            return null;
        }

        return isAdsPhase ? alternativeVideoEl : mainVideoEl;
    }

    #isAdsPhase() {
        return document.querySelector('[data-a-target="video-ad-countdown"]') !== null;
    }

    checkBanPhase() {
        const errorCheckData = {
            successfulChecks: 0,
            totalChecks: 0,
            isBan: true
        };

        const videoEl = this.#getActiveVideoEl();

        // Some problems with video
        if (!videoEl) {
            this.#lastCheckData = errorCheckData;
            this.#clearCanvas();
            return this.#events.emit('check');
        }

        // Stream went offline
        if (videoEl.paused || videoEl.ended) {
            this.#lastCheckData = errorCheckData;

            clearInterval(this.#intervalId);
            this.#clearCanvas();

            return this.#events.emit('reload');
        }

        this.#makeScreenshot(videoEl);

        const canvas = this.#canvasEl;
        const { width, height } = canvas;

        const checksResults = banPhaseChecks.map(({ xPercent, yPercent, color }) => {
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

        const successfulChecks = checksResults.filter(({ similarity, actual }) => {
            const isBlack = actual === '000000';
            return isBlack ? true : similarity >= 0.85;
        });

        this.#lastCheckData = {
            successfulChecks: successfulChecks.length,
            totalChecks: banPhaseChecks.length,
            isBan: successfulChecks.length / banPhaseChecks.length >= 0.7
        };

        console.log(this.#lastCheckData);

        this.#clearCanvas();
        this.#events.emit('check');
    }

    get isBanPhase() {
        return this.#lastCheckData.isBan;
    }

    get lastCheckData() {
        return this.#lastCheckData;
    }

    #makeScreenshot(videoEl) {
        this.#canvasEl.width = videoEl.clientWidth;
        this.#canvasEl.height = videoEl.clientHeight;

        const ctx = this.#canvasEl.getContext('2d');

        ctx.drawImage(videoEl, 0, 0, this.#canvasEl.width, this.#canvasEl.height);
    }

    #clearCanvas() {
        const ctx = this.#canvasEl.getContext('2d');

        ctx.clearRect(0, 0, this.#canvasEl.width, this.#canvasEl.height);
    }

    // #listenEvents() {
    //     document.body.addEventListener('click', ({ target, pageX, pageY }) => {
    //         const canvasEl = this.#canvasEl;
    //
    //         function getPosition(element) {
    //             let left = 0;
    //             let top = 0;
    //
    //             if (element.offsetParent) {
    //                 do {
    //                     left += element.offsetLeft;
    //                     top += element.offsetTop;
    //                 } while (element = element.offsetParent);
    //
    //                 return { left, top };
    //             }
    //
    //             return { left: 0, top: 0 };
    //         }
    //
    //         if (target === canvasEl) {
    //             const { width, height } = canvasEl;
    //
    //             const { left, top } = getPosition(canvasEl);
    //             const x = pageX - left;
    //             const y = pageY - top;
    //             const context = canvasEl.getContext('2d');
    //             const [r, g, b] = context.getImageData(x, y, 1, 1).data;
    //             const color = ColorService.rgbToHex(r, g, b);
    //
    //             console.log({
    //                 color,
    //                 xPercent: x / width * 100,
    //                 yPercent: y / height * 100
    //             });
    //         }
    //     });
    // }
}
