export class GlobalSettingsService {
    static create() {
        return new GlobalSettingsService({ storage: chrome.storage.local });
    }

    static #STORAGE_KEY = 'hgf-helper.settings';

    static #DEFAULT_SETTINGS = {
        jsonBinUrl: '',
        jsonBinMasterKey: '',
        jsonBinAccessKey: ''
    };

    #settings = {};
    #storage;

    constructor({ storage }) {
        this.#storage = storage;
    }

    get settings() {
        return this.#settings;
    }

    getSetting(name) {
        return this.#settings[name];
    }

    async loadSettings() {
        const settings = await this.#storage.get([GlobalSettingsService.#STORAGE_KEY]);
        this.#settings = {
            ...GlobalSettingsService.#DEFAULT_SETTINGS,
            ...settings[GlobalSettingsService.#STORAGE_KEY]
        };
    }

    updateSettings(settings) {
        this.#settings = { ...this.#settings, ...settings };
        this.#storage.set({ [GlobalSettingsService.#STORAGE_KEY]: this.#settings });
    }
}
