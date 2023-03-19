export class OfferView {
    #offer;
    #offerEl;
    #storageService;

    constructor({ offer, offerEl, storageService }) {
        this.#offer = offer;
        this.#offerEl = offerEl;
        this.#storageService = storageService;

        this.#toggleOffer();
        this.#listenEvents();
    }

    #listenEvents() {
        this.#offerEl.addEventListener('dblclick', () => {
            this.#storageService.hideOffer(this.#offer.name);
            this.#hideOffer();
        });
    }

    #toggleOffer() {
        if (this.#offer.isSoldOut || this.#storageService.isOfferHidden(this.#offer.name)) {
            this.#hideOffer();
        }
    }

    #hideOffer() {
        this.#offerEl.style.display = 'none';
    }
}
