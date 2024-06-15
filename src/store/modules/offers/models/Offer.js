export class Offer {
    #name;
    #count;
    #price;
    #description;
    #steamAppLink;

    constructor({
        name, count, price, description
    }) {
        this.#name = name;
        this.#count = count;
        this.#price = price;
        this.#description = description;
        this.#steamAppLink = this.#getSteamAppLink();
    }

    get name() {
        return this.#name;
    }

    get price() {
        return this.#price;
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

    get steamAppLink() {
        return this.#steamAppLink;
    }

    #getSteamAppLink() {
        const appPrefix = 'https://store.steampowered.com/app';

        if (this.#description.includes(appPrefix)) {
            const regex = new RegExp(`${appPrefix}/\\d+/\\w+/`);
            return this.#description.match(regex)[0];
        }

        const bundlePrefix = 'https://store.steampowered.com/sub';

        if (this.#description.includes(bundlePrefix)) {
            const regex = new RegExp(`${bundlePrefix}/\\d+/`);
            return this.#description.match(regex)[0];
        }

        return `https://store.steampowered.com/search/?term=${this.#name}`;
    }
}
