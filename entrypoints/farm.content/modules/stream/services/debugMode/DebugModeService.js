import './style.css';
import template from './template.html?raw';
import { ColorService } from '../../../shared';

export class DebugModeService {
    #el;
    #canvasEl;
    #debugModeChecks = [];

    constructor() {
        this.#el = this.#createElement();
        this.#canvasEl = this.#el.querySelector('[data-debug-mode-canvas]');
        this._clickHandler = this._clickHandler.bind(this);

        document.body.appendChild(this.#el);
    }

    renderVideoFrame(videoEl) {
        this.#canvasEl.width = videoEl.clientWidth;
        this.#canvasEl.height = videoEl.clientHeight;

        const ctx = this.#canvasEl.getContext('2d');

        ctx.drawImage(videoEl, 0, 0, this.#canvasEl.width, this.#canvasEl.height);
    }

    #createElement() {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild;
    }

    _clickHandler({ pageX, pageY }) {
        const x = pageX - this.#canvasEl.offsetLeft;
        const y = pageY - this.#canvasEl.offsetTop;

        const context = this.#canvasEl.getContext('2d');
        const [r, g, b] = context.getImageData(x, y, 1, 1).data;
        const color = ColorService.rgbToHex(r, g, b);

        this.#debugModeChecks.push({
            color,
            xPercent: (x / this.#canvasEl.width) * 100,
            yPercent: (y / this.#canvasEl.height) * 100
        });

        console.info(`Logged: ${this.#debugModeChecks.length}`);
    }

    enterDebugMode() {
        this.#el.classList.add('visible');
        this.#canvasEl.addEventListener('click', this._clickHandler);
    }

    exitDebugMode() {
        this.#el.classList.remove('visible');
        this.#canvasEl.removeEventListener('click', this._clickHandler);

        if (this.#debugModeChecks.length) {
            console.info(this.#debugModeChecks);
            this.#debugModeChecks = [];
        }
    }
}
