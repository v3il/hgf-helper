import { Offer } from '../models';

export class OffersFactory {
    createOffer(options) {
        return new Offer(options);
    }
}
