import { ColorService } from './ColorService';
import { banPhaseChecks } from '../consts/banPhaseChecks';
import { EventEmitter } from '../models/EventsEmitter';
import { Commands, Timing } from '../consts';

export class StreamStatusService {
    static create({ canvasContainerEl, twitchChatObserver }) {
        return new StreamStatusService({
            canvasContainerEl,
            twitchChatObserver,
            events: EventEmitter.create()
        });
    }

    #canvasContainerEl;
    #canvasEl;
    #lastCheckData;
    #events;
    #intervalId;
    #twitchChatObserver;

    #reloadRoundsCount = 0;

    #enteredCommandsCount = 50;

    constructor({ canvasContainerEl, twitchChatObserver, events }) {
        this.#canvasContainerEl = canvasContainerEl;
        this.#twitchChatObserver = twitchChatObserver;
        this.#events = events;

        this.#canvasEl = this.#createCanvas();
        this.#canvasContainerEl.appendChild(this.#canvasEl);

        this.checkBanPhase();

        this.#intervalId = setInterval(() => {
            this.checkBanPhase();
        }, 20 * Timing.SECOND);

        // this.#checkStreamBotIsActive();

        // this.#listenEvents();
    }

    get events() {
        return this.#events;
    }

    #checkStreamBotIsActive() {
        this.#twitchChatObserver.events.on('message', ({ message }) => {
            const isCommand = Commands.getGameCommands().some((command) => message.startsWith(command));

            if (isCommand) {
                this.#enteredCommandsCount++;

                console.error(this.#enteredCommandsCount);
            }
        });
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
        const videoEl = this.#getActiveVideoEl();

        // Some problems with video
        if (!videoEl) {
            this.#lastCheckData = {
                successfulChecks: 0,
                totalChecks: 0,
                isBan: true
            };

            this.#clearCanvas();
            return this.#events.emit('check');
        }

        // Stream went offline
        if (videoEl.paused || videoEl.ended) {
            this.#reloadRoundsCount++;

            const isReload = this.#reloadRoundsCount === 3;

            console.error(this.#reloadRoundsCount, isReload);

            this.#lastCheckData = {
                successfulChecks: 0,
                totalChecks: 0,
                isBan: true,
                isReload
            };

            if (isReload) {
                clearInterval(this.#intervalId);
            }

            this.#clearCanvas();

            return this.#events.emit('check');
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

        const failedChecks = checksResults.filter(({ similarity, actual }) => {
            const isBlack = actual === '000000';
            return isBlack ? true : similarity >= 0.85;
        });

        const isEnoughFailedChecks = failedChecks.length / banPhaseChecks.length >= 0.7;
        const isStreamBotActive = this.#enteredCommandsCount > 6;

        // console.error(isEnoughFailedChecks, isStreamBotActive);

        this.#lastCheckData = {
            successfulChecks: failedChecks.length,
            totalChecks: banPhaseChecks.length,
            isBan: isEnoughFailedChecks // || !isStreamBotActive
        };

        console.log(this.#lastCheckData);

        this.#reloadRoundsCount = 0;
        this.#enteredCommandsCount = 0;
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
