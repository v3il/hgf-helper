type HandlerPayload = object | void | string | number | boolean;
export type EventHandler<T = HandlerPayload> = ((payload?: T) => void) | (() => void);
export type UnsubscribeTrigger = () => void;

export class EventEmitter<T extends Record<string, HandlerPayload>> {
    static create<TEvents extends Record<string, HandlerPayload>>() {
        return new EventEmitter<TEvents>();
    }

    private events: { [K in keyof T]?: EventHandler<T[K]>[] } = {};

    on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): UnsubscribeTrigger {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event]!.push(handler);

        return () => this.off(event, handler);
    }

    off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
        if (!this.events[event]) return;
        this.events[event] = this.events[event]!.filter((h) => h !== handler);
    }

    emit<K extends keyof T>(event: K, payload?: T[K]): void {
        if (!this.events[event]) return;
        this.events[event]!.forEach((handler) => handler(payload));
    }
}
