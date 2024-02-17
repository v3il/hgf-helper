import { JsonBinApiService, StorageService } from './services';
import { SettingsFacade } from '../../../shared/settings';

export class OffersFacade {
    static _instance;

    static get instance() {
        if (!this._instance) {
            const settingsFacade = SettingsFacade.instance;

            const apiService = new JsonBinApiService({
                jsonBinUrl: settingsFacade.getGlobalSetting('jsonBinUrl'),
                jsonBinMasterKey: settingsFacade.getGlobalSetting('jsonBinMasterKey'),
                jsonBinAccessKey: settingsFacade.getGlobalSetting('jsonBinAccessKey')
            });

            const offersService = new StorageService({ apiService });

            this._instance = new OffersFacade({ offersService });
        }

        return this._instance;
    }

    #offersService;

    constructor({ offersService }) {
        this.#offersService = offersService;
    }
}
