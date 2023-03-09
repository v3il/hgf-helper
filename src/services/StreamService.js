import html2canvas from 'html2canvas';
import { ColorService } from './ColorService';
import { banPhaseChecks } from '../banPhaseChecks';

export class StreamService {
    #canvasContainerEl;
    #mediaPlayerEl;
    #canvasEl;

    _lastCheckData;

    events;

    constructor({ canvasContainerEl, mediaPlayerEl, events }) {
        this.#canvasContainerEl = canvasContainerEl;
        this.#mediaPlayerEl = mediaPlayerEl;
        this.events = events;

        setInterval(() => {
            this.checkBanPhase();
        }, 25000);

        // this.#listenEvents();
    }

    async checkBanPhase() {
        await this.#makeScreenshot();

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

        console.table(checksResults);

        const successfulChecks = checksResults.filter(({ similarity, actual }) => {
            const isBlack = actual === '000000';
            return isBlack ? true : similarity >= 0.85;
        });

        console.log('Successful checks:', successfulChecks.length, '/', banPhaseChecks.length);

        this._lastCheckData = {
            successfulChecks: successfulChecks.length,
            totalChecks: banPhaseChecks.length,
            isBan: successfulChecks.length / banPhaseChecks.length >= 0.7
        };

        this.events.emit('check');
    }

    get isBanPhase() {
        return this._lastCheckData.isBan;
    }

    get lastCheckData() {
        return this._lastCheckData;
    }

    async #makeScreenshot() {
        this.#canvasContainerEl.innerHTML = '';

        const canvasEl = await html2canvas(this.#mediaPlayerEl);

        this.#canvasEl = canvasEl;
        this.#canvasContainerEl.appendChild(canvasEl);
    }

    // async isStreamOnline() {
    //     const response = await fetch(window.location.href);
    //     const pageHTML = await response.text();
    //
    //     return pageHTML.includes('isLiveBroadcast');
    // }

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
