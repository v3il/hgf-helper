import './style.css';
import template from './template.html?raw';
import { ColorService } from '../../services';

export class CanvasContainer {
    static create(rootEl) {
        return new CanvasContainer().mount(rootEl);
    }

    #el;
    #canvasEl;
    #isDebug = false;
    #checks = [];

    constructor() {
        this.#el = this.#createElement();
        this.#canvasEl = this.#el.querySelector('[data-canvas]');
        this._clickHandler = this._clickHandler.bind(this);
    }

    get el() {
        return this.#el;
    }

    get canvasEl() {
        return this.#canvasEl;
    }

    mount(rootEl) {
        rootEl.appendChild(this.el);
        return this;
    }

    #getActiveVideoEl() {
        const isAdsPhase = !!document.querySelector('[data-a-target="video-ad-countdown"]');
        const [mainVideoEl, alternativeVideoEl] = document.querySelectorAll('video');

        if (isAdsPhase && !alternativeVideoEl) {
            return null;
        }

        return isAdsPhase ? alternativeVideoEl : mainVideoEl;
    }

    renderVideoFrame() {
        const videoEl = this.#getActiveVideoEl();

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

        this.#checks.push({
            color,
            xPercent: (x / this.#canvasEl.width) * 100,
            yPercent: (y / this.#canvasEl.height) * 100
        });

        console.info(`Logged: ${this.#checks.length}`);
    }

    #startDebug() {
        this.#isDebug = true;
        this.#el.classList.add('haf-container--debug');
        this.#canvasEl.addEventListener('click', this._clickHandler);
    }

    #endDebug() {
        this.#isDebug = false;
        this.#el.classList.remove('haf-container--debug');
        this.#canvasEl.removeEventListener('click', this._clickHandler);

        if (this.#checks.length) {
            console.info(this.#checks);
            this.#checks = [];
        }
    }

    toggleDebug() {
        this.#isDebug ? this.#endDebug() : this.#startDebug();
    }
}
