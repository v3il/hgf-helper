import { Container } from 'typedi';

export class BasicFacade {
    static _instance;
    static container = Container;
    static providers = [];

    static get instance() {
        if (!this._instance) {
            this.container.set(this.providers.concat({ id: this, type: this }));
            this._instance = this.container.get(this);
        }

        return this._instance;
    }
}
