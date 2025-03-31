import { Container } from 'typedi';
import { OffersFacade } from '@store/modules';
import { UserFacade } from '@shared/settings';
import { OfferView } from './OfferView';

export class OffersList {
    private readonly userFacade;
    private readonly offersFacade;

    private offerViews: OfferView[] = [];

    constructor(private readonly el: HTMLElement) {
        this.userFacade = Container.get(UserFacade);
        this.offersFacade = Container.get(OffersFacade);

        this.renderOffers = this.renderOffers.bind(this);

        this.initOfferViews();
        this.listenEvents();
    }

    private initOfferViews() {
        const offerViews = Array.from(this.el.querySelectorAll<HTMLElement>('.stream-store-list-item'));

        this.offerViews = offerViews.map((offerEl) => {
            const gameNameEl = offerEl.querySelector<HTMLHeadingElement>('.item-title')!;
            const countEl = offerEl.querySelector<HTMLSpanElement>('.item-quantity-left span')!;
            const itemCostEl = offerEl.querySelector<HTMLParagraphElement>('.item-cost')!;
            const descriptionEl = offerEl.querySelector<HTMLParagraphElement>('.clamp-description-text')!;

            const name = gameNameEl.getAttribute('title')!.toLowerCase().trim();
            const count = countEl.textContent!.toLowerCase().trim();
            const price = itemCostEl.lastChild!.textContent!.trim();
            const description = descriptionEl.textContent!.toLowerCase().trim();

            const offer = this.offersFacade.createOffer({
                name,
                count,
                price,
                description
            });

            return new OfferView({ offerEl, offer });
        });
    }

    private listenEvents() {
        this.offersFacade.events.on('offer-shown', this.renderOffers);
        this.userFacade.onSettingChanged('hideSoldOutOffers', this.renderOffers);
        this.userFacade.onSettingChanged('offersMaxPrice', this.renderOffers);
    }

    private renderOffers() {
        this.offerViews.forEach((offerView) => offerView.toggleVisibility());
    }
}
