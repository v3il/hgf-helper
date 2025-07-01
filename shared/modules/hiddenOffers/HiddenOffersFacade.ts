import { Container, Service } from 'typedi';
import { HiddenOffersService } from './HiddenOffersService.svelte';
import { FirebaseApiService } from '../FirebaseApiService';
import { HiddenOffersMigrator, IMigrateOffersParams } from './HiddenOffersMigrator';
import { RequestSender } from '../RequestSender';

@Service()
export class HiddenOffersFacade {
    private hiddenOffersService!: HiddenOffersService;
    private hiddenOffersMigrator!: HiddenOffersMigrator;

    private container = Container.of('hiddenOffers');

    constructor() {
        this.initProviders();
    }

    private initProviders() {
        this.container.set({ id: RequestSender, value: Container.get(RequestSender) });
        this.container.set({ id: FirebaseApiService, value: Container.get(FirebaseApiService) });
        this.container.set({ id: HiddenOffersService, type: HiddenOffersService });
        this.container.set({ id: HiddenOffersMigrator, type: HiddenOffersMigrator });

        this.hiddenOffersService = this.container.get(HiddenOffersService);
        this.hiddenOffersMigrator = this.container.get(HiddenOffersMigrator);
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

    unhideOffer(offer: string) {
        return this.hiddenOffersService.unhideOffer(offer);
    }

    migrateHiddenOffers(params: IMigrateOffersParams) {
        return this.hiddenOffersMigrator.migrate(params);
    }
}
