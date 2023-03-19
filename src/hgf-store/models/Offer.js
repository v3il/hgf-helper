export class Offer {
    static create(data) {
        return new Offer(data);
    }

    _name;
    _count;
    _price;

    constructor({ name, count, price }) {
        this._name = name;
        this._count = count;
        this._price = price;
    }

    get isSoldOut() {
        return this._count === 'sold out';
    }
}
