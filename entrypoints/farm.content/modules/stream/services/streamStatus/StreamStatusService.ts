import { ColorService } from '@farm/modules/shared';
import { StreamStatus, Timing } from '@farm/consts';
import { TwitchFacade } from '@farm/modules/twitch';
import {
    BasicView, EventEmitter, log, OnScreenTextRecognizer
} from '@components/shared';
import './style.css';
import { ChatFacade } from '@farm/modules/chat';
import { getRandomNumber } from '@farm/utils';
import { Inject } from 'typedi';
import { TwitchChatService } from '@farm/modules/chat/services';
import { TwitchElementsRegistry } from '@farm/modules/twitch/services';
import {
    antiCheatChecks, anticheatName, chestGameChecks, ICheck, lootGameChecks
} from './checks';
import template from './template.html?raw';

// interface IParams {
//     twitchFacade: TwitchFacade;
//     chatFacade: ChatFacade;
//     textDecoderService: OnScreenTextRecognizer;
// }

export class StreamStatusService extends BasicView {
    private readonly canvasEl;

    // @Inject()
    private readonly twitchElementsRegistry!: TwitchElementsRegistry;

    // @Inject()
    private readonly twitchChatService!: TwitchChatService;

    // @Inject()
    private readonly textDecoderService!: OnScreenTextRecognizer;

    private statuses!: StreamStatus[];

    private isLootGame?: boolean;
    private isChestGame?: boolean;

    readonly events = new EventEmitter<{
        loot: boolean,
        chest: boolean
    }>();

    private anticheatHandled = false;

    constructor() {
        super(template);

        // this.twitchFacade = params.twitchFacade;
        // this.chatFacade = params.chatFacade;
        // this.textDecoderService = params.textDecoderService;
        this.canvasEl = this.el.querySelector<HTMLCanvasElement>('[data-canvas]')!;

        this.mount(document.body);
    }

    async checkStreamStatus() {
        const { activeVideoEl } = this.twitchElementsRegistry;

        this.statuses = [StreamStatus.OK];

        if (!activeVideoEl || activeVideoEl.paused || activeVideoEl.ended) {
            this.statuses = [StreamStatus.BROKEN];
            log(this.statuses);
            log('Video is broken');
            return;
        }

        this.renderVideoFrame(activeVideoEl);

        this.checkLootGame();
        this.checkChestGame();

        const isAntiCheat = this.isAntiCheat();

        if (isAntiCheat) {
            this.startAntiCheatProcessing();
        } else {
            this.anticheatHandled = false;
        }
    }

    private async startAntiCheatProcessing() {
        if (this.anticheatHandled) {
            return;
        }

        const result = await this.recognize();

        console.error('AntiCheat result:', result);

        if (result > 0.85) {
            const delay = getRandomNumber(3 * Timing.SECOND, 15 * Timing.SECOND);

            this.anticheatHandled = true;
            console.log(`Send anticheat in ${delay}!`);

            setTimeout(() => {
                this.twitchChatService.sendMessage('!anticheat');
            }, delay);
        }
    }

    async recognize() {
        return this.recognizeText(anticheatName, this.twitchFacade.twitchUserName);
    }

    private async recognizeText(points: ICheck[], str: string) {
        const x = Math.floor((points[0].xPercent * this.canvasEl.width) / 100);
        const y = Math.floor((points[0].yPercent * this.canvasEl.height) / 100);
        const width = Math.floor((points[1].xPercent * this.canvasEl.width) / 100) - x;
        const height = Math.floor((points[2].yPercent * this.canvasEl.height) / 100) - y;

        const ctx = this.canvasEl.getContext('2d')!;
        const imageData = ctx.getImageData(x, y, width, height);

        return this.textDecoderService.checkOnScreen(imageData, str);
    }

    private renderVideoFrame(videoEl: HTMLVideoElement) {
        this.canvasEl.width = videoEl.clientWidth;
        this.canvasEl.height = videoEl.clientHeight;

        const ctx = this.canvasEl.getContext('2d')!;

        ctx.drawImage(videoEl, 0, 0, this.canvasEl.width, this.canvasEl.height);
    }

    private isAntiCheat() {
        const failedChecks = this.checkPoints(antiCheatChecks);
        const isAntiCheat = (failedChecks / antiCheatChecks.length) >= 0.5;

        // this.log(`${failedChecks} / ${antiCheatChecks.length}`, isAntiCheat ? 'error' : 'info');

        return isAntiCheat;
    }

    private checkLootGame() {
        const previousStatus = this.isLootGame;
        const failedChecks = this.checkPoints(lootGameChecks);

        // console.log(`Loot: ${failedChecks} / ${lootGameChecks.length}`, isLootGame ? 'error' : 'info');

        this.isLootGame = (failedChecks / lootGameChecks.length) >= 0.7;

        if (previousStatus !== this.isLootGame) {
            this.events.emit('loot', this.isLootGame);
        }
    }

    private checkChestGame() {
        const previousStatus = this.isChestGame;
        const failedChecks = this.checkPoints(chestGameChecks);

        // console.log(`Chest: ${failedChecks} / ${chestGameChecks.length}`, isAntiCheat ? 'error' : 'info');

        this.isChestGame = (failedChecks / chestGameChecks.length) >= 0.7;

        if (previousStatus !== this.isChestGame) {
            this.events.emit('chest', this.isChestGame);
        }
    }

    private checkPoints(points: ICheck[]): number {
        const { width, height } = this.canvasEl;

        const checksResults = points.map(({ xPercent, yPercent, color }) => {
            const x = Math.floor((xPercent * width) / 100);
            const y = Math.floor((yPercent * height) / 100);

            const context = this.canvasEl.getContext('2d', { willReadFrequently: true })!;
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

        return failedChecks.length;
    }

    get isVideoBroken() {
        return this.statuses.includes(StreamStatus.BROKEN);
    }

    get isAntiCheatScreen() {
        return this.statuses.includes(StreamStatus.ANTI_CHEAT);
    }

    get isStreamOk() {
        return this.statuses.includes(StreamStatus.OK);
    }

    get isGiveawayFrenzy() {
        return this.statuses.includes(StreamStatus.FRENZY);
    }

    // handleStreamStatusCheck() {
    //     // streamFacade.checkStreamStatus();
    //     // renderStatus();
    //     // brokenStreamHandler.handleBrokenVideo(streamFacade.isVideoBroken);
    //
    //     const nextCheckDelay = this.getNextCheckDelay();
    //
    //     setTimeout(() => {
    //         this.handleStreamStatusCheck();
    //     }, nextCheckDelay);
    // }
    //
    // private getNextCheckDelay() {
    //     // if (streamFacade.isAntiCheatScreen) {
    //     //     return ANTI_CHEAT_DURATION + 10 * Timing.SECOND;
    //     // }
    //
    //     return 2 * Timing.SECOND;
    // }
}
