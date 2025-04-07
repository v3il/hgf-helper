import { UnsubscribeTrigger } from '@shared/EventEmitter';

export abstract class BasicView {
    protected listeners: UnsubscribeTrigger[] = [];
    protected readonly el: HTMLElement;

    constructor(template: string) {
        this.el = this.createElement(template);
    }

    private createElement(template: string) {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild! as HTMLElement;
    }

    abstract render(rootEl: HTMLElement): void;

    destroy() {
        this.listeners.forEach((unsubscribe) => unsubscribe());
        this.listeners = [];
        this.el.remove();
    }
}
