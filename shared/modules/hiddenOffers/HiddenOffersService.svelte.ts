import { ContainerInstance } from 'typedi';
import { FirebaseApiService } from '../FirebaseApiService';

export class HiddenOffersService {
    private readonly apiService: FirebaseApiService;

    private _hiddenOffers: string[] = $state([]);

    constructor(container: ContainerInstance) {
        this.apiService = container.get(FirebaseApiService);
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
        this._hiddenOffers.push(offer);
        return this.apiService.updateHiddenOffers(this.hiddenOffers);
    }

    async mergeHiddenOffers(offers: string[]) {
        let count = 0;

        for (const offer of offers) {
            if (!this.isOfferHidden(offer)) {
                this._hiddenOffers.push(offer);
                count++;
            }
        }

        await this.apiService.updateHiddenOffers(this._hiddenOffers);

        return count;
    }

    setHiddenOffers(hiddenOffers: string[]) {
        this._hiddenOffers = hiddenOffers;
    }
}
