import './style.css';
import template from './template.html?raw';

export class CanvasContainer {
    static create(rootEl) {
        return new CanvasContainer().mount(rootEl);
    }

    #el;
    #canvasEl;

    constructor() {
        this.#el = this.#createElement();
        this.#canvasEl = this.#el.querySelector('[data-canvas]');
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

    renderVideoFrame(videoEl) {
        this.#canvasEl.width = videoEl.clientWidth;
        this.#canvasEl.height = videoEl.clientHeight;

        const ctx = this.#canvasEl.getContext('2d');

        ctx.drawImage(videoEl, 0, 0, this.#canvasEl.width, this.#canvasEl.height);
    }

    clearCanvas() {
        const ctx = this.#canvasEl.getContext('2d');

        ctx.clearRect(0, 0, this.#canvasEl.width, this.#canvasEl.height);
    }

    #createElement() {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild;
    }

    // #listenEvents() {
    //     document.body.addEventListener('click', ({ target, pageX, pageY }) => {
    //         const canvasEl = this.#canvasEl;
    //
    //         function getPosition(element) {
    //             let left = 0;
    //             let top = 0;
    //
    //             if (element.offsetParent) {
    //                 do {
    //                     left += element.offsetLeft;
    //                     top += element.offsetTop;
    //                 } while (element = element.offsetParent);
    //
    //                 return { left, top };
    //             }
    //
    //             return { left: 0, top: 0 };
    //         }
    //
    //         if (target === canvasEl) {
    //             const { width, height } = canvasEl;
    //
    //             const { left, top } = getPosition(canvasEl);
    //             const x = pageX - left;
    //             const y = pageY - top;
    //             const context = canvasEl.getContext('2d');
    //             const [r, g, b] = context.getImageData(x, y, 1, 1).data;
    //             const color = ColorService.rgbToHex(r, g, b);
    //
    //             console.log({
    //                 color,
    //                 xPercent: x / width * 100,
    //                 yPercent: y / height * 100
    //             });
    //         }
    //     });
    // }
}
