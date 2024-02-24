import { OfferView } from '@/store/views/offer/OfferView';

export class OffersList {
    #el;
    #offersFacade;
    #settingsFacade;
    #offerViews = [];

    constructor({ el, offersFacade, settingsFacade }) {
        this.#el = el;
        this.#offersFacade = offersFacade;
        this.#settingsFacade = settingsFacade;

        this.#initOfferViews();
        this.#observeSettingsChange();
    }

    #initOfferViews() {
        const offerViews = Array.from(this.#el.querySelectorAll('.stream-store-list-item'));

        this.#offerViews = offerViews.map((offerEl) => {
            const gameNameEl = offerEl.querySelector('.item-title');
            const countEl = offerEl.querySelector('.item-quantity-left span');
            const itemCostEl = offerEl.querySelector('.item-cost');

            const name = gameNameEl.getAttribute('title').toLowerCase().trim();
            const count = countEl.textContent.toLowerCase().trim();
            const price = itemCostEl.lastChild.textContent.trim();

            return new OfferView({
                offerEl,
                offer: this.#offersFacade.createOffer({ name, count, price }),
                offersFacade: this.#offersFacade,
                settingsFacade: this.#settingsFacade
            });
        });
    }

    #observeSettingsChange() {
        this.#settingsFacade.onGlobalSettingChanged('offersMaxPrice', (v) => {
            console.error(v);
            console.error(this.#settingsFacade.getGlobalSetting('offersMaxPrice'));
            this.#offerViews.forEach((offerView) => offerView.toggleOffer());
        });
    }
}
