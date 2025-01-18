export class BasicView {
    protected readonly el: HTMLElement;

    constructor(template: string) {
        this.el = this.createElement(template);
    }

    private createElement(template: string) {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild! as HTMLElement;
    }

    mount(rootEl: HTMLElement) {
        rootEl.appendChild(this.el);
    }
}
