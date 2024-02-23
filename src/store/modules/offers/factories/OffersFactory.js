import { Offer } from '@/store/modules/offers/models';

export class OffersFactory {
    createOffer(options) {
        return new Offer(options);
    }
}
