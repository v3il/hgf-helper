import { Container, Service } from 'typedi';
import { EventEmitter } from '@components/EventEmitter';
import { HiddenOffersFacade } from '@shared/modules';
import { Offer, IOfferParams } from './models';

@Service()
export class OffersFacade {
    private readonly userFacade: HiddenOffersFacade;

    readonly events = new EventEmitter<{
        'offer-shown': void;
    }>();

    constructor() {
        this.userFacade = Container.get(HiddenOffersFacade);
    }

    get hiddenOffers() {
        return this.userFacade.hiddenOffers;
    }

    createOffer(options: IOfferParams) {
        return new Offer(options);
    }

    isOfferHidden(offer: Offer) {
        return this.userFacade.isOfferHidden(offer.name);
    }

    async unhideOffer(offer: string) {
        await this.userFacade.unhideOffer(offer);
        this.events.emit('offer-shown');
    }

    hideOffer(offer: Offer) {
        return this.userFacade.hideOffer(offer.name);
    }
}
