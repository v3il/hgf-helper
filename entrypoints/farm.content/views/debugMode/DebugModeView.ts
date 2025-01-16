import './style.css';
import template from './template.html?raw';
import { ColorService } from '../../modules/shared';
import { TwitchFacade } from '../../modules/twitch';

interface IDebugModeCheck {
    color: string;
    xPercent: number;
    yPercent: number;
}

export class DebugModeView {
    private readonly el;
    private readonly canvasEl;
    private readonly twitchFacade;

    private isActive = false;
    private checks: IDebugModeCheck[] = [];

    constructor(twitchFacade: TwitchFacade) {
        this.twitchFacade = twitchFacade;
        this.el = this.createElement();
        this.canvasEl = this.el.querySelector<HTMLCanvasElement>('[data-debug-mode-canvas]')!;
        this.clickHandler = this.clickHandler.bind(this);

        document.body.appendChild(this.el);
    }

    private renderVideoFrame() {
        const videoEl = this.twitchFacade.activeVideoEl;

        if (!videoEl) {
            return;
        }

        this.canvasEl.width = videoEl.clientWidth;
        this.canvasEl.height = videoEl.clientHeight;

        const ctx = this.canvasEl.getContext('2d')!;

        ctx.drawImage(videoEl, 0, 0, this.canvasEl.width, this.canvasEl.height);
    }

    private createElement() {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild! as HTMLElement;
    }

    private clickHandler({ pageX, pageY }: MouseEvent) {
        const x = pageX - this.canvasEl.offsetLeft;
        const y = pageY - this.canvasEl.offsetTop;

        const context = this.canvasEl.getContext('2d')!;
        const [r, g, b] = context.getImageData(x, y, 1, 1).data;
        const color = ColorService.rgbToHex(r, g, b);

        this.checks.push({
            color,
            xPercent: (x / this.canvasEl.width) * 100,
            yPercent: (y / this.canvasEl.height) * 100
        });

        console.info(`Logged: ${this.checks.length}`);
    }

    private enterDebugMode() {
        this.renderVideoFrame();
        this.el.classList.add('visible');
        this.canvasEl.addEventListener('click', this.clickHandler);
    }

    private exitDebugMode() {
        this.el.classList.remove('visible');
        this.canvasEl.removeEventListener('click', this.clickHandler);

        if (this.checks.length) {
            console.info(this.checks);
            this.checks = [];
        }
    }

    toggle() {
        this.isActive = !this.isActive;
        this.isActive ? this.enterDebugMode() : this.exitDebugMode();
    }
}
