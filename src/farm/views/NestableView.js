import { EventEmitter } from '@/farm/modules/shared';

export class NestableView {
    constructor({ el }) {
        this.el = el;
        this.events = new EventEmitter();
    }
}
