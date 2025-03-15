export interface IOfferParams {
    name: string;
    count: string;
    price: string;
    description: string;
}

export class Offer {
    private readonly rawCount;

    readonly name;
    readonly count;
    readonly price;
    readonly description;
    readonly steamAppLink;

    constructor(params: IOfferParams) {
        this.rawCount = params.count;

        this.name = params.name;
        this.count = this.parseString(params.count);
        this.price = this.parseString(params.price);
        this.description = params.description;
        this.steamAppLink = this.getSteamAppLink();
    }

    get isDeficiency() {
        return this.count > 0 && this.count < 10;
    }

    get isSoldOut() {
        return this.rawCount === 'sold out';
    }

    private parseString(count: string) {
        const value = Number.parseInt(count, 10);
        return Number.isNaN(value) ? 0 : value;
    }

    private getSteamAppLink() {
        const appPrefix = 'https://store.steampowered.com/app';

        if (this.description.includes(appPrefix)) {
            const regex = new RegExp(`${appPrefix}/\\d+/\\w+/`);
            return this.description.match(regex)![0];
        }

        const bundlePrefix = 'https://store.steampowered.com/sub';

        if (this.description.includes(bundlePrefix)) {
            const regex = new RegExp(`${bundlePrefix}/\\d+/`);
            return this.description.match(regex)![0];
        }

        return `https://store.steampowered.com/search/?term=${this.name}`;
    }
}
