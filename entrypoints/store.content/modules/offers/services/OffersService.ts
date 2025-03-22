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

    unhideOffer(offer: string) {
        this._hiddenOffers = this._hiddenOffers.filter((hiddenOffer) => hiddenOffer !== offer);
        return this.apiService.updateHiddenOffers(this._hiddenOffers);
    }

    hideOffer(offer: Offer) {
        this.hiddenOffers.push(offer.name);
        return this.apiService.updateHiddenOffers(this.hiddenOffers);
    }
}
