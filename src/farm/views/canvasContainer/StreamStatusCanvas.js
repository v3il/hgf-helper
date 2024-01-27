import './style.css';
import template from './template.html?raw';

export class StreamStatusCanvas {
    static create(rootEl) {
        return new StreamStatusCanvas().mount(rootEl);
    }

    #el;
    #canvasEl;

    constructor() {
        this.#el = this.#createElement();
        this.#canvasEl = this.#el.querySelector('[data-canvas]');
    }

    get canvasEl() {
        return this.#canvasEl;
    }

    mount(rootEl) {
        rootEl.appendChild(this.#el);
        return this;
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
}
