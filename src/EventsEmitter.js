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
    }

    emit(event, data = {}) {
        (this.storage[event] || []).forEach((callback) => callback(data));
    }
}
