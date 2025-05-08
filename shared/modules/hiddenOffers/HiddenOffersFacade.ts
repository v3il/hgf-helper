import { Container, Service } from 'typedi';
import { HiddenOffersService } from './HiddenOffersService.svelte';
import { FirebaseApiService } from '../FirebaseApiService';

@Service()
export class HiddenOffersFacade {
    private hiddenOffersService!: HiddenOffersService;

    private container = Container.of('hiddenOffers');

    constructor() {
        this.initProviders();
    }

    private initProviders() {
        this.container.set({ id: FirebaseApiService, value: Container.get(FirebaseApiService) });
        this.container.set({ id: HiddenOffersService, type: HiddenOffersService });

        this.hiddenOffersService = this.container.get(HiddenOffersService);
    }

    get hiddenOffers() {
        return this.hiddenOffersService.hiddenOffers;
    }

    setHiddenOffers(hiddenOffers: string[]) {
        this.hiddenOffersService.setHiddenOffers(hiddenOffers);
    }

    isOfferHidden(offer: string) {
        return this.hiddenOffersService.isOfferHidden(offer);
    }

    hideOffer(offer: string) {
        return this.hiddenOffersService.hideOffer(offer);
    }

    hideOffers(offers: string[]) {
        return this.hiddenOffersService.hideOffers(offers);
    }

    unhideOffer(offer: string) {
        return this.hiddenOffersService.unhideOffer(offer);
    }
}
