import { Container, Service } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { ColorService } from '@shared/services';
import { Timing } from '@shared/consts';

@Service()
export class OffscreenStreamRenderer {
    private canvasEl!: HTMLCanvasElement;

    private readonly twitchUIService!: TwitchUIService;
    private readonly colorService!: ColorService;

    private timeoutId!: number;

    constructor() {
        this.twitchUIService = Container.get(TwitchUIService);
        this.colorService = Container.get(ColorService);

        this.createCanvas();
        this.renderVideoFrame();

        this.timeoutId = window.setInterval(() => {
            this.renderVideoFrame();
        }, Timing.SECOND);
    }

    destroy() {
        clearInterval(this.timeoutId);
        this.canvasEl.remove();
    }

    getColorAtPoint(x: number, y: number) {
        const context = this.canvasEl.getContext('2d', { willReadFrequently: true })!;
        const [r, g, b] = context.getImageData(x, y, 1, 1).data;

        return this.colorService.rgbToHex(r, g, b);
    }

    getColorAtPointPercent(xPercent: number, yPercent: number) {
        const { width, height } = this.canvasEl;
        const x = Math.floor((xPercent * width) / 100);
        const y = Math.floor((yPercent * height) / 100);

        return this.getColorAtPoint(x, y);
    }

    getImageData(x: number, y: number, width: number, height: number) {
        const context = this.canvasEl.getContext('2d', { willReadFrequently: true })!;

        return context.getImageData(x, y, width, height);
    }

    getImageDataPercent(xPercent: number, yPercent: number, widthPercent: number, heightPercent: number) {
        const fullWidth = this.canvasEl.width;
        const fullHeight = this.canvasEl.height;

        const x = Math.floor((xPercent * fullWidth) / 100);
        const y = Math.floor((yPercent * fullHeight) / 100);
        const width = Math.floor((widthPercent * fullWidth) / 100);
        const height = Math.floor((heightPercent * fullHeight) / 100);

        return this.getImageData(x, y, width, height);
    }

    private createCanvas() {
        this.canvasEl = document.createElement('canvas');

        this.canvasEl.classList.add('fixed', 'top-0', 'left-[-10000px]', 'z-[20000]');

        document.body.appendChild(this.canvasEl);
    }

    private renderVideoFrame() {
        const videoEl = this.twitchUIService.activeVideoEl;

        this.canvasEl.width = videoEl?.clientWidth ?? 0;
        this.canvasEl.height = videoEl?.clientHeight ?? 0;

        const ctx = this.canvasEl.getContext('2d', { willReadFrequently: true })!;

        if (videoEl) {
            ctx.drawImage(videoEl, 0, 0, this.canvasEl.width, this.canvasEl.height);
        } else {
            ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        }
    }
}
