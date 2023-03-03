import './style.css';

export class CanvasContainer {
    static create() {
        return new CanvasContainer();
    }

    #el;

    constructor() {
        this.#el = this._createElement();
    }

    get el() {
        return this.#el;
    }

    mount(rootEl) {
        rootEl.appendChild(this.el);
        return this.el;
    }

    _createElement() {
        const containerEl = document.createElement('div');
        containerEl.classList.add('haf-container');

        return containerEl;
    }
}
