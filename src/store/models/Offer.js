export class Offer {
    #name;
    #count;
    #price;

    constructor({ name, count, price }) {
        this.#name = name;
        this.#count = count;
        this.#price = price;
    }

    get name() {
        return this.#name;
    }

    get isSoldOut() {
        return this.#count === 'sold out';
    }
}
