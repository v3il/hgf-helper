import { SettingsFacade } from '@components/shared';
import { JsonBinApiService, OffersService } from './services';
import { OffersFactory } from './factories';

export class OffersFacade {
    static _instance;

    static get instance() {
        if (!this._instance) {
            const settings = SettingsFacade.instance.globalSettings;
            const offersFactory = new OffersFactory();

            const apiService = new JsonBinApiService({
                jsonBinUrl: settings.jsonBinUrl,
                jsonBinMasterKey: settings.jsonBinMasterKey,
                jsonBinAccessKey: settings.jsonBinAccessKey
            });

            const offersService = new OffersService({ apiService });

            this._instance = new OffersFacade({ offersService, offersFactory });
        }

        return this._instance;
    }

    #offersFactory;
    #offersService;

    constructor({ offersService, offersFactory }) {
        this.#offersFactory = offersFactory;
        this.#offersService = offersService;
    }

    createOffer(options) {
        return this.#offersFactory.createOffer(options);
    }

    fetchHiddenOffers() {
        return this.#offersService.fetchHiddenOffers();
    }

    isOfferHidden(offerName) {
        return this.#offersService.isOfferHidden(offerName);
    }

    hideOffer(offerName) {
        return this.#offersService.hideOffer(offerName);
    }
}
