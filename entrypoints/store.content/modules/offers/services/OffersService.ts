import { ContainerInstance } from 'typedi';
import { Offer } from '../models';
import { JsonBinApiService } from './JsonBinApiService';

export class OffersService {
    private readonly apiService;
    private _hiddenOffers: string[] = [];

    constructor(container: ContainerInstance) {
        this.apiService = container.get(JsonBinApiService);
    }

    get hiddenOffers() {
        return this._hiddenOffers;
    }

    async fetchHiddenOffers() {
        this._hiddenOffers = await this.apiService.getHiddenOffers();
    }

    isOfferHidden(offer: Offer) {
        return this._hiddenOffers.includes(offer.name);
    }

    hideOffer(offer: Offer) {
        this.hiddenOffers.push(offer.name);
        return this.apiService.updateHiddenOffers(this.hiddenOffers);
    }
}
