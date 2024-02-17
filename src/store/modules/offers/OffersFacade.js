import { JsonBinApiService, OffersService } from './services';
import { SettingsFacade } from '@/shared/settings';
import { OffersFactory } from '@/store/modules/offers/factories';

export class OffersFacade {
    static _instance;

    static get instance() {
        if (!this._instance) {
            const settingsFacade = SettingsFacade.instance;

            const offersFactory = new OffersFactory();

            const apiService = new JsonBinApiService({
                jsonBinUrl: settingsFacade.getGlobalSetting('jsonBinUrl'),
                jsonBinMasterKey: settingsFacade.getGlobalSetting('jsonBinMasterKey'),
                jsonBinAccessKey: settingsFacade.getGlobalSetting('jsonBinAccessKey')
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
