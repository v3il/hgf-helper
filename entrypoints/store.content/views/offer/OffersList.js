import { Container } from 'typedi';
import { OfferView } from './OfferView';
import { GlobalSettingsService } from '../../../../components/shared';

export class OffersList {
    #el;
    #offersFacade;
    #settingsService;
    #offerViews = [];

    constructor({ el, offersFacade }) {
        this.#el = el;
        this.#offersFacade = offersFacade;
        this.#settingsService = Container.get(GlobalSettingsService);

        this.#initOfferViews();
        this.#observeSettingsChange();
    }

    #initOfferViews() {
        const offerViews = Array.from(this.#el.querySelectorAll('.stream-store-list-item'));

        this.#offerViews = offerViews.map((offerEl) => {
            const gameNameEl = offerEl.querySelector('.item-title');
            const countEl = offerEl.querySelector('.item-quantity-left span');
            const itemCostEl = offerEl.querySelector('.item-cost');
            const descriptionEl = offerEl.querySelector('.clamp-description-text');

            const name = gameNameEl.getAttribute('title').toLowerCase().trim();
            const count = countEl.textContent.toLowerCase().trim();
            const price = itemCostEl.lastChild.textContent.trim();
            const description = descriptionEl.textContent.toLowerCase().trim();

            const offer = this.#offersFacade.createOffer({
                name, count, price, description
            });

            return new OfferView({
                offerEl,
                offer,
                offersFacade: this.#offersFacade
            });
        });
    }

    #observeSettingsChange() {
        this.#settingsService.events.on('setting-changed:offersMaxPrice', () => {
            this.#offerViews.forEach((offerView) => offerView.toggleOffer());
        });
    }
}
