import { hiddenOffers } from '../consts/hiddenOffers';

export class StorageService {
    #hiddenOffers = [];
    #storageKey = 'hgfs.offers';

    constructor() {
        this.#hiddenOffers = this.#getHiddenOffers();
    }

    #getHiddenOffers() {
        return hiddenOffers;

        // const items = window.localStorage.getItem(this.#storageKey);
        //
        // if (items) {
        //     this.#hiddenOffers = JSON.parse(items);
        // }
    }

    #saveHiddenOffers() {
        window.localStorage.setItem(this.#storageKey, JSON.stringify(this.#hiddenOffers));
    }

    isOfferHidden(offerName) {
        console.error(offerName);
        return this.#hiddenOffers.includes(offerName);
    }

    hideOffer(offerName) {
        this.#hiddenOffers.push(offerName);
        this.#saveHiddenOffers();
    }
}
