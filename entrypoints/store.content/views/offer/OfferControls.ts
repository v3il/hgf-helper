import { Container } from 'typedi';
import { GlobalSettingsService } from '@components/settings';
import { OffersFacade } from '@store/modules';
import { OfferView } from './OfferView';

export class OfferControls {
    private readonly offersFacade;
    private readonly settingsService;

    private offerViews: OfferView[] = [];

    constructor(private readonly el: HTMLElement) {
        this.offersFacade = Container.get(OffersFacade);
        this.settingsService = Container.get(GlobalSettingsService);

        this.initOfferViews();
        this.observeSettingsChange();
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

    private observeSettingsChange() {
        this.settingsService.events.on('setting-changed:offersMaxPrice', () => {
            this.offerViews.forEach((offerView) => offerView.toggleVisibility());
        });
    }
}
