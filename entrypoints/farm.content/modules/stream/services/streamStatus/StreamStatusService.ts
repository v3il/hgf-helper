import { ColorService } from '@farm/modules/shared';
import { StreamStatus, Timing } from '@farm/consts';
import { TwitchFacade } from '@farm/modules/twitch';
import {
    BasicView, log, OnScreenTextRecognizer
} from '@components/shared';
import './style.css';
import { ChatFacade } from '@farm/modules/chat';
import template from './template.html?raw';
import { ICheck, antiCheatChecks, giveawayFrenzyChecks } from './checks';

interface IParams {
    twitchFacade: TwitchFacade;
    chatFacade: ChatFacade;
    textDecoderService: OnScreenTextRecognizer;
}

export class StreamStatusService extends BasicView {
    private readonly canvasEl;
    private readonly twitchFacade;
    private readonly chatFacade;
    private readonly textDecoderService;

    private statuses!: StreamStatus[];

    private isAnticheatProcessing = false;
    private anticheatTimeout!: number;

    constructor(params: IParams) {
        super(template);

        this.twitchFacade = params.twitchFacade;
        this.chatFacade = params.chatFacade;
        this.textDecoderService = params.textDecoderService;
        this.canvasEl = this.el.querySelector<HTMLCanvasElement>('[data-canvas]')!;

        this.mount(document.body);
    }

    checkStreamStatus() {
        const { activeVideoEl } = this.twitchFacade;

        this.statuses = [StreamStatus.OK];

        if (!activeVideoEl || activeVideoEl.paused || activeVideoEl.ended) {
            this.statuses = [StreamStatus.BROKEN];
            log(this.statuses);
            log('Video is broken');
            return;
        }

        this.renderVideoFrame(activeVideoEl);

        const isAntiCheat = this.isAntiCheat();

        if (!isAntiCheat) {
            this.stopAntiCheatProcessing();
            return;
        }

        if (this.isAnticheatProcessing) {
            this.statuses = [StreamStatus.ANTI_CHEAT];
            return;
        }

        this.startAntiCheatProcessing();

        // if (this.isAntiCheat() && !this.isAnticheatProcessing) {
        //     this.statuses = [StreamStatus.ANTI_CHEAT];
        //     this.startAntiCheatProcessing();
        // } else {
        //     this.stopAntiCheatProcessing();
        // }

        // console.error(this.statuses);
    }

    private startAntiCheatProcessing() {
        this.isAnticheatProcessing = true;

        let counter = 0;

        console.error('Start anticheat processing!!!');

        this.anticheatTimeout = window.setInterval(async () => {
            if (await this.recognize()) {
                counter++;
                console.error('Anticheat Counter:', counter);
            }

            if (counter >= 5) {
                this.chatFacade.sendMessage('!anticheat');
                console.log('Send anticheat!!!');
                clearInterval(this.anticheatTimeout);
                this.isAnticheatProcessing = false;
            }
        }, 3 * Timing.SECOND);
    }

    private stopAntiCheatProcessing() {
        if (!this.isAnticheatProcessing) return;

        console.error('Stop anticheat processing!!!');
        clearInterval(this.anticheatTimeout);
        this.isAnticheatProcessing = false;
    }

    async recognize() {
        const points = [
            {
                color: '#bf3bbf',
                xPercent: 20.539546290619253,
                yPercent: 82.00654307524536
            },
            {
                color: '#be3ad2',
                xPercent: 79.70570202329858,
                yPercent: 88.54961832061069
            },
            {
                color: '#bc2aa2',
                xPercent: 79.82832618025752,
                yPercent: 89.33151581243183
            },
            {
                color: '#c133a2',
                xPercent: 20.478234212139792,
                yPercent: 89.6401308615049
            }
        ];

        const x = Math.floor((points[0].xPercent * this.canvasEl.width) / 100);
        const y = Math.floor((points[0].yPercent * this.canvasEl.height) / 100);
        const width = Math.floor((points[1].xPercent * this.canvasEl.width) / 100) - x;
        const height = Math.floor((points[2].yPercent * this.canvasEl.height) / 100) - y;

        const ctx = this.canvasEl.getContext('2d')!;
        const imageData = ctx.getImageData(x, y, width, height);
        const username = await this.textDecoderService.checkOnScreen(imageData, this.twitchFacade.twitchUserName);
        const username2 = await this.textDecoderService.checkOnScreen(imageData, 'mur_cha_7');

        console.error(
            username,
            username2
        );

        return username;
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
