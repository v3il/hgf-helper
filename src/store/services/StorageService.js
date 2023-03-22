export class StorageService {
    #apiService;
    #hiddenOffers = [];

    constructor({ apiService }) {
        this.#apiService = apiService;
    }

    async fetchHiddenOffers() {
        this.#hiddenOffers = await this.#apiService.getHiddenOffers();
    }

    isOfferHidden(offerName) {
        return this.#hiddenOffers.includes(offerName);
    }

    hideOffer(offerName) {
        this.#hiddenOffers.push(offerName);
        return this.#apiService.updateHiddenOffers(this.#hiddenOffers);
    }
}
