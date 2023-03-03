import './style.css';

export class CanvasContainer {
    static create() {
        return new CanvasContainer();
    }

    #el;

    constructor() {
        // eslint-disable-next-line no-underscore-dangle
        this.#el = this._createElement();
    }

    get el() {
        return this.#el;
    }

    mount(rootEl) {
        rootEl.appendChild(this.el);
        return this.el;
    }

    // eslint-disable-next-line no-underscore-dangle
    _createElement() {
        const containerEl = document.createElement('div');
        containerEl.classList.add('haf-container');

        return containerEl;
    }
}
