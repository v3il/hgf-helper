export class EventEmitter {
    static create() {
        return new EventEmitter();
    }

    storage = {};

    on(event, handler) {
        if (!this.storage[event]) {
            this.storage[event] = [];
        }

        this.storage[event].push(handler);

        return () => {
            this.storage[event] = this.storage[event].filter((callback) => callback !== handler);
        };
    }

    emit(event, data = {}) {
        (this.storage[event] || []).forEach((callback) => callback(data));
    }
}
