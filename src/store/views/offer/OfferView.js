import template from './template.html?raw';
import './styles.css';

export class OfferView {
    #offer;
    #offerEl;
    #offersFacade;
    #settingsFacade;

    constructor({
        offer, offerEl, offersFacade, settingsFacade
    }) {
        this.#offer = offer;
        this.#offerEl = offerEl;
        this.#offersFacade = offersFacade;
        this.#settingsFacade = settingsFacade;

        this.#renderContainer();
        this.toggleOffer();
        this.#listenEvents();
    }

    get #isHidden() {
        const offersMaxPrice = this.#settingsFacade.getGlobalSetting('offersMaxPrice');

        return this.#offer.isSoldOut
            || this.#offer.price > offersMaxPrice
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

        // todo
        hideButtonEl.addEventListener('click', () => {
            // eslint-disable-next-line no-alert
            if (!window.confirm('Hide?')) {
                return;
            }

            this.#offersFacade.hideOffer(this.#offer.name);
            this.#hideOffer();
        });
    }

    toggleOffer() {
        this.#isHidden ? this.#hideOffer() : this.#showOffer();
    }

    #hideOffer() {
        this.#offerEl.classList.add('hgfs-offer--hidden');
    }

    #showOffer() {
        this.#offerEl.classList.remove('hgfs-offer--hidden');
    }
}
