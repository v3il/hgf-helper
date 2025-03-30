import { ContainerInstance } from 'typedi';
import { UserApiService } from './UserApiService';

export class HiddenOffersService {
    private readonly apiService: UserApiService;

    private _hiddenOffers!: string[];

    constructor(container: ContainerInstance) {
        this.apiService = container.get(UserApiService);
    }

    get hiddenOffers() {
        return this._hiddenOffers;
    }

    isOfferHidden(offer: string) {
        return this._hiddenOffers.includes(offer);
    }

    unhideOffer(offer: string) {
        this._hiddenOffers = this._hiddenOffers.filter((hiddenOffer) => hiddenOffer !== offer);
        return this.apiService.updateHiddenOffers(this._hiddenOffers);
    }

    hideOffer(offer: string) {
        this.hiddenOffers.push(offer);
        return this.apiService.updateHiddenOffers(this.hiddenOffers);
    }

    setHiddenOffers(hiddenOffers: string[]) {
        this._hiddenOffers = hiddenOffers;
    }
}
