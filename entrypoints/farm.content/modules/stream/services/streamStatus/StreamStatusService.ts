import { ColorService } from '@farm/modules/shared';
import { StreamStatus } from '@farm/consts';
import { TwitchFacade } from '@farm/modules/twitch';
import {
    BasicView, log, TextDecoderService
} from '@components/shared';
import './style.css';
import template from './template.html?raw';
import { ICheck, antiCheatChecks, giveawayFrenzyChecks } from './checks';

interface IParams {
    twitchFacade: TwitchFacade;
    textDecoderService: TextDecoderService;
}

export class StreamStatusService extends BasicView {
    private readonly canvasEl;
    private readonly twitchFacade;
    private readonly textDecoderService;

    private statuses!: StreamStatus[];

    constructor(params: IParams) {
        super(template);

        this.twitchFacade = params.twitchFacade;
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

        if (this.isAntiCheat()) {
            this.statuses = [StreamStatus.ANTI_CHEAT];
            this.recognize();
        }

        if (this.isFrenzy()) {
            this.statuses.push(StreamStatus.FRENZY);
        }

        // console.error(this.statuses);
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

        // const points2 = [
        //     {
        //         color: '#ab3de5',
        //         xPercent: 20.588235294117645,
        //         yPercent: 87.95811518324608
        //     },
        //     {
        //         color: '#bc2ba2',
        //         xPercent: 79.70588235294119,
        //         yPercent: 86.38743455497382
        //     },
        //     {
        //         color: '#a90d41',
        //         xPercent: 79.41176470588235,
        //         yPercent: 97.90575916230367
        //     },
        //     {
        //         color: '#c1020e',
        //         xPercent: 20.294117647058822,
        //         yPercent: 97.90575916230367
        //     }
        // ];

        const x = Math.floor((points[0].xPercent * this.canvasEl.width) / 100);
        const y = Math.floor((points[0].yPercent * this.canvasEl.height) / 100);
        const width = Math.floor((points[1].xPercent * this.canvasEl.width) / 100) - x;
        const height = Math.floor((points[2].yPercent * this.canvasEl.height) / 100) - y;

        // const x2 = Math.floor((points2[0].xPercent * this.canvasEl.width) / 100);
        // const y2 = Math.floor((points2[0].yPercent * this.canvasEl.height) / 100);
        // const width2 = Math.floor((points2[1].xPercent * this.canvasEl.width) / 100) - x2;
        // const height2 = Math.floor((points2[2].yPercent * this.canvasEl.height) / 100) - y2;

        const ctx = this.canvasEl.getContext('2d')!;
        const imageData = ctx.getImageData(x, y, width, height);
        const username = await this.textDecoderService.checkOnScreen(imageData, this.twitchFacade.twitchUserName);
        const username2 = await this.textDecoderService.checkOnScreen(imageData, 'mur_cha_7');

        // const imageData2 = ctx.getImageData(x2, y2, width2, height2);
        // const text = await this.textDecoderService.recognizeText(imageData2);

        console.error(
            username,
            username2
        );
        // console.error();
        // console.error(text);
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

    private isFrenzy() {
        const failedChecks = this.checkPoints(giveawayFrenzyChecks);
        const isFrenzy = (failedChecks / giveawayFrenzyChecks.length) >= 0.5;

        // this.log(`${failedChecks} / ${giveawayFrenzyChecks.length}`, isFrenzy ? 'error' : 'info');

        return isFrenzy;
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
}
