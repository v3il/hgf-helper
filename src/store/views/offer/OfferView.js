import template from './template.html?raw';
import './styles.css';

export class OfferView {
    #offer;
    #offerEl;
    #offersFacade;

    constructor({ offer, offerEl, offersFacade }) {
        this.#offer = offer;
        this.#offerEl = offerEl;
        this.#offersFacade = offersFacade;

        this.#renderContainer();
        this.#toggleOffer();
        this.#listenEvents();
    }

    get #isHidden() {
        console.error(this.#offer.isSoldOut
            || this.#offer.isTooExpensive
            || this.#offersFacade.isOfferHidden(this.#offer.name));

        return this.#offer.isSoldOut
            || this.#offer.isTooExpensive
            || this.#offersFacade.isOfferHidden(this.#offer.name);
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

            this.#offersFacade.hideOffer(this.#offer.name);
            this.#hideOffer();
        });
    }

    #toggleOffer() {
        if (this.#isHidden) {
            this.#hideOffer();
        }
    }

    #hideOffer() {
        this.#offerEl.classList.add('hgfs-offer--hidden');
    }
}
