import { Container } from 'typedi';
import { ColorService } from './ColorService';
import { EventEmitter } from '../models/EventsEmitter';
import { InjectionTokens, Timing, antiCheatChecks } from '../consts';

export class StreamStatusService {
    static create({ canvasView }) {
        const twitchChatObserver = Container.get(InjectionTokens.CHAT_OBSERVER);
        const twitchPlayerService = Container.get(InjectionTokens.PLAYER_SERVICE);

        return new StreamStatusService({
            canvasView,
            twitchChatObserver,
            twitchPlayerService,
            events: EventEmitter.create()
        });
    }

    #canvasView;
    #lastCheckData;
    #events;
    #intervalId;
    #twitchChatObserver;
    #twitchPlayerService;

    #reloadRoundsCount = 0;

    constructor({
        canvasView, twitchChatObserver, twitchPlayerService, events
    }) {
        this.#canvasView = canvasView;
        this.#twitchChatObserver = twitchChatObserver;
        this.#events = events;
        this.#twitchPlayerService = twitchPlayerService;

        this.#checkBanPhase();

        this.#intervalId = setInterval(() => {
            this.#checkBanPhase();
            twitchPlayerService.decreaseVideoDelay();
        }, 40 * Timing.SECOND);
    }

    get events() {
        return this.#events;
    }

    checkBanPhase() {
        this.#checkBanPhase();
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

    #checkBanPhase() {
        const videoEl = this.#getActiveVideoEl();

        // Some problems with video
        if (!videoEl) {
            this.#lastCheckData = {
                successfulChecks: 0,
                totalChecks: 0,
                isBan: true
            };

            return this.#events.emit('check');
        }

        // Stream went offline
        if (videoEl.paused || videoEl.ended) {
            this.#reloadRoundsCount++;

            const isReload = this.#reloadRoundsCount === 3;

            this.#lastCheckData = {
                successfulChecks: 0,
                totalChecks: 0,
                isBan: true,
                isReload
            };

            if (isReload) {
                clearInterval(this.#intervalId);
            }

            return this.#events.emit('check');
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

        const isEnoughFailedChecks = failedChecks.length / antiCheatChecks.length >= 0.6;

        this.#lastCheckData = {
            successfulChecks: failedChecks.length,
            totalChecks: antiCheatChecks.length,
            isBan: isEnoughFailedChecks
        };

        console.log(this.#lastCheckData);

        this.#reloadRoundsCount = 0;
        this.#events.emit('check');
    }

    get isBanPhase() {
        return this.#lastCheckData.isBan;
    }

    get lastCheckData() {
        return this.#lastCheckData;
    }
}
