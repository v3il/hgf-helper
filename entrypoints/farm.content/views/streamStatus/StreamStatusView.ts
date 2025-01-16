import { ColorService } from '../../modules/shared';
import { StreamStatus } from '../../consts';
import { antiCheatChecks } from './antiCheatChecks';
import './style.css';
import template from './template.html?raw';
import { TwitchFacade } from '../../modules/twitch';
import { BasicView } from '../BasicView';

export class StreamStatusView extends BasicView {
    private readonly canvasEl;
    private readonly twitchFacade;

    private status!: StreamStatus;

    constructor(twitchFacade: TwitchFacade) {
        super(template);

        this.twitchFacade = twitchFacade;
        this.canvasEl = this.el.querySelector<HTMLCanvasElement>('[data-canvas]')!;

        this.mount(document.body);
    }

    checkStreamStatus() {
        const { activeVideoEl } = this.twitchFacade;

        this.status = StreamStatus.OK;

        if (!activeVideoEl || activeVideoEl.paused || activeVideoEl.ended) {
            this.status = StreamStatus.BROKEN;
            this.log('Video is broken', 'warn');
            return;
        }

        this.renderVideoFrame(activeVideoEl);

        if (this.isAntiCheat()) {
            this.status = StreamStatus.ANTI_CHEAT;
        }
    }

    private renderVideoFrame(videoEl: HTMLVideoElement) {
        this.canvasEl.width = videoEl.clientWidth;
        this.canvasEl.height = videoEl.clientHeight;

        const ctx = this.canvasEl.getContext('2d')!;

        ctx.drawImage(videoEl, 0, 0, this.canvasEl.width, this.canvasEl.height);
    }

    private isAntiCheat() {
        const { width, height } = this.canvasEl;

        const checksResults = antiCheatChecks.map(({ xPercent, yPercent, color }) => {
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

        const isAntiCheat = (failedChecks.length / antiCheatChecks.length) >= 0.5;

        this.log(`${failedChecks.length} / ${antiCheatChecks.length}`, isAntiCheat ? 'error' : 'info');

        return isAntiCheat;
    }

    log(message: string, type: 'error' | 'warn' | 'info') {
        const date = new Date().toLocaleString();
        console[type](`[${date}]: ${message}`);
    }

    get isVideoBroken() {
        return this.status === StreamStatus.BROKEN;
    }

    get isAntiCheatScreen() {
        return this.status === StreamStatus.ANTI_CHEAT;
    }

    get isStreamOk() {
        return this.status === StreamStatus.OK;
    }
}
