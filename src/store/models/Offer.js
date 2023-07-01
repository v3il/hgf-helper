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

    get countValue() {
        const value = Number.parseInt(this.#count, 10);
        return Number.isNaN(value) ? 0 : value;
    }

    get isDeficiency() {
        return this.countValue > 0 && this.countValue < 10;
    }

    get isSoldOut() {
        return this.#count === 'sold out';
    }

    get isTooExpensive() {
        return this.#price > 75000;
    }
}
