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

        this._clickHandler = this._clickHandler.bind(this);

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

        if (this.#offer.steamAppLink) {
            const steamAppLinkEl = this.#offerEl.querySelector('[data-steam-app-link]');

            steamAppLinkEl.href = this.#offer.steamAppLink;
            steamAppLinkEl.classList.remove('hidden');
        }

        if (this.#offer.isDeficiency) {
            this.#offerEl.querySelector('[data-container]').classList.add('hgfs-container--danger');
        }
    }

    #listenEvents() {
        if (!this.#isHidden) {
            this.#attachClickListener();
        }
    }

    #attachClickListener() {
        const hideButtonEl = this.#offerEl.querySelector('[data-hide]');

        hideButtonEl.addEventListener('click', this._clickHandler);
    }

    #removeClickListener() {
        const hideButtonEl = this.#offerEl.querySelector('[data-hide]');

        hideButtonEl.removeEventListener('click', this._clickHandler);
    }

    _clickHandler() {
        // eslint-disable-next-line no-alert
        if (!window.confirm('Hide?')) {
            return;
        }

        this.#offersFacade.hideOffer(this.#offer.name);
        this.#hideOffer();
    }

    toggleOffer() {
        this.#isHidden ? this.#hideOffer() : this.#showOffer();
    }

    #hideOffer() {
        this.#removeClickListener();
        this.#offerEl.classList.add('hgfs-offer--hidden');
    }

    #showOffer() {
        this.#attachClickListener();
        this.#offerEl.classList.remove('hgfs-offer--hidden');
    }
}
