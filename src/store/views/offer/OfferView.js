import template from './template.html?raw';
import './styles.css';

export class OfferView {
    #offer;
    #offerEl;
    #storageService;

    constructor({ offer, offerEl, storageService }) {
        this.#offer = offer;
        this.#offerEl = offerEl;
        this.#storageService = storageService;

        this.#renderContainer();
        this.#toggleOffer();
        this.#listenEvents();
    }

    get #isHidden() {
        return this.#offer.isSoldOut
            || this.#offer.isTooExpensive
            || this.#storageService.isOfferHidden(this.#offer.name);
    }

    #renderContainer() {
        this.#offerEl.insertAdjacentHTML('beforeend', template);

        if (this.#offer.isDeficiency) {
            this.#offerEl.querySelector('[data-container]').classList.add('hgfs-container--danger');
        }
    }

    #listenEvents() {
        if (this.#isHidden) {
            return;
        }

        const hideButtonEl = this.#offerEl.querySelector('[data-hide]');

        hideButtonEl.addEventListener('click', () => {
            // eslint-disable-next-line no-alert
            if (!window.confirm('Hide?')) {
                return;
            }

            this.#storageService.hideOffer(this.#offer.name);
            this.#hideOffer();
        });
    }

    #toggleOffer() {
        if (this.#isHidden) {
            this.#hideOffer();
        }
    }

    #hideOffer() {
        this.#offerEl.style.display = 'none';
    }
}
