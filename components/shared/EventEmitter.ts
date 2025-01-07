type EventHandler = (data: object) => void;

export class EventEmitter {
    static create() {
        return new EventEmitter();
    }

    private storage: Record<string, EventHandler[]> = {};

    on(event: string, handler: EventHandler) {
        this.storage[event] ??= [];
        this.storage[event].push(handler);

        return () => {
            this.storage[event] = this.storage[event].filter((callback) => callback !== handler);
        };
    }

    emit(event: string, data: object = {}) {
        (this.storage[event] || []).forEach((callback) => callback(data));
    }
}
