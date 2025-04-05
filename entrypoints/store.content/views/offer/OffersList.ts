import { Container } from 'typedi';
import { OffersFacade } from '@store/modules';
import { SettingsFacade } from '@shared/modules';
import { BasicView } from '@components/BasicView';
import { OfferView } from './OfferView';

export class OffersList extends BasicView {
    private readonly settingsFacade;
    private readonly offersFacade;
    private readonly offersEl!: HTMLElement;

    private offerViews: OfferView[] = [];

    constructor(offersEl: HTMLElement) {
        super('<div></div>');

        this.offersEl = offersEl;

        this.settingsFacade = Container.get(SettingsFacade);
        this.offersFacade = Container.get(OffersFacade);

        this.renderOffers = this.renderOffers.bind(this);

        this.render();
        this.listenEvents();
    }

    render() {
        const offerViews = Array.from(this.offersEl.querySelectorAll<HTMLElement>('.stream-store-list-item'));

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
        const unsubscribe1 = this.offersFacade.events.on('offer-shown', this.renderOffers);
        const unsubscribe2 = this.settingsFacade.onSettingChanged('hideSoldOutOffers', this.renderOffers);
        const unsubscribe3 = this.settingsFacade.onSettingChanged('offersMaxPrice', this.renderOffers);

        this.listeners.push(unsubscribe1, unsubscribe2, unsubscribe3);
    }

    private renderOffers() {
        this.offerViews.forEach((offerView) => offerView.toggleVisibility());
    }

    destroy() {
        this.offerViews.forEach((view) => view.destroy());
        super.destroy();
    }
}
