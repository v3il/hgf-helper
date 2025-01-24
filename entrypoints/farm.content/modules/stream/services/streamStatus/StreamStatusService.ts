import { ColorService } from '@farm/modules/shared';
import { StreamStatus } from '@farm/consts';
import { TwitchFacade } from '@farm/modules/twitch';
import { BasicView } from '@components/shared';
import './style.css';
import template from './template.html?raw';
import { ICheck, antiCheatChecks, giveawayFrenzyChecks } from './checks';

export class StreamStatusService extends BasicView {
    private readonly canvasEl;
    private readonly twitchFacade;

    private statuses!: StreamStatus[];

    constructor(twitchFacade: TwitchFacade) {
        super(template);

        this.twitchFacade = twitchFacade;
        this.canvasEl = this.el.querySelector<HTMLCanvasElement>('[data-canvas]')!;

        this.mount(document.body);
    }

    checkStreamStatus() {
        const { activeVideoEl } = this.twitchFacade;

        this.statuses = [StreamStatus.OK];

        if (!activeVideoEl || activeVideoEl.paused || activeVideoEl.ended) {
            this.statuses = [StreamStatus.BROKEN];
            console.error(this.statuses);
            this.log('Video is broken', 'warn');
            return;
        }

        this.renderVideoFrame(activeVideoEl);

        if (this.isAntiCheat()) {
            this.statuses = [StreamStatus.ANTI_CHEAT];
        }

        if (this.isFrenzy()) {
            console.error(`${new Date().toLocaleString()} Frenzy detected`);
            this.statuses.push(StreamStatus.FRENZY);
        }

        // console.error(this.statuses);
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

    private log(message: string, type: 'error' | 'warn' | 'info') {
        const date = new Date().toLocaleString();
        console[type](`[${date}]: ${message}`);
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
