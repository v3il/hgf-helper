import { StreamElementsRegistry } from './services';

export class StreamElementsFacade {
    static _instance;

    static get instance() {
        if (!this._instance) {
            const elementsRegistry = new StreamElementsRegistry();
            this._instance = new StreamElementsFacade({ elementsRegistry });
        }

        return this._instance;
    }

    #elementsRegistry;

    constructor({ elementsRegistry }) {
        this.#elementsRegistry = elementsRegistry;
    }

    get offersListEl() {
        return this.#elementsRegistry.offersListEl;
    }

    init(callback) {
        this.#elementsRegistry.onElementsReady(callback);
    }

    async sortOffersByCost() {
        await this.#elementsRegistry.sortOffersByCost();
    }
}
