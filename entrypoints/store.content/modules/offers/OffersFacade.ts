import { Container, Service } from 'typedi';
import { EventEmitter } from '@shared/EventEmitter';
import { HiddenOffersFacade } from '@shared/modules';
import { Offer, IOfferParams } from './models';
import { IMigrateOffersParams } from '@shared/modules/hiddenOffers';

@Service()
export class OffersFacade {
    private readonly hiddenOffersFacade: HiddenOffersFacade;

    readonly events = new EventEmitter<{
        'offer-shown': void;
    }>();

    constructor() {
        this.hiddenOffersFacade = Container.get(HiddenOffersFacade);
    }

    get hiddenOffers() {
        return this.hiddenOffersFacade.hiddenOffers;
    }

    createOffer(options: IOfferParams) {
        return new Offer(options);
    }

    isOfferHidden(offer: Offer) {
        return this.hiddenOffersFacade.isOfferHidden(offer.name);
    }

    async unhideOffer(offer: string) {
        await this.hiddenOffersFacade.unhideOffer(offer);
        this.events.emit('offer-shown');
    }

    hideOffer(offer: Offer) {
        return this.hiddenOffersFacade.hideOffer(offer.name);
    }

    migrateHiddenOffers(params: IMigrateOffersParams) {
        return this.hiddenOffersFacade.migrateHiddenOffers(params);
    }
}
