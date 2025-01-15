type EventHandler<T = object> = (payload: T) => void;

export class EventEmitter<T extends Record<string, object | void>> {
    static create<TEvents extends Record<string, object | void>>() {
        return new EventEmitter<TEvents>();
    }

    private events: { [K in keyof T]?: EventHandler<T[K]>[] } = {};

    on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event]!.push(handler);
    }

    off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
        if (!this.events[event]) return;
        this.events[event] = this.events[event]!.filter((h) => h !== handler);
    }

    emit<K extends keyof T>(event: K, payload: T[K]): void {
        if (!this.events[event]) return;
        this.events[event]!.forEach((handler) => handler(payload));
    }
}
