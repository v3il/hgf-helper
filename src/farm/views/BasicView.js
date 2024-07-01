export class BasicView {
    constructor(template) {
        this.el = this.#createElement(template);
    }

    mount(rootEl) {
        rootEl.appendChild(this.el);
    }

    #createElement(template) {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild;
    }
}
