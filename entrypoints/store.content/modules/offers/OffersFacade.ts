import { Container, Service } from 'typedi';
import { JsonBinApiService, OffersService } from './services';
import { Offer, IOfferParams } from './models';

@Service()
export class OffersFacade {
    private readonly offersService: OffersService;

    private container = Container.of('offers');

    constructor() {
        this.container.set({ id: OffersService, type: OffersService });
        this.container.set({ id: JsonBinApiService, type: JsonBinApiService });

        this.offersService = this.container.get(OffersService);
    }

    get hiddenOffers() {
        return this.offersService.hiddenOffers;
    }

    createOffer(options: IOfferParams) {
        return new Offer(options);
    }

    fetchHiddenOffers() {
        return this.offersService.fetchHiddenOffers();
    }

    isOfferHidden(offer: Offer) {
        return this.offersService.isOfferHidden(offer);
    }

    hideOffer(offer: Offer) {
        return this.offersService.hideOffer(offer);
    }
}
