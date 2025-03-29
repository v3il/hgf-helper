import { EventEmitter } from '@components/EventEmitter';

export class BasicView {
    protected readonly el: HTMLElement;
    readonly events = EventEmitter.create();

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

    destroy() {
        this.el.remove();
    }
}
