export class SettingsService {
    static create() {
        return new SettingsService({ storage: chrome.storage.local });
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
        const settings = await this.#storage.get([SettingsService.#STORAGE_KEY]);
        this.#settings = { ...SettingsService.#DEFAULT_SETTINGS, ...settings[SettingsService.#STORAGE_KEY] };
    }

    updateSettings(settings) {
        this.#settings = { ...this.#settings, ...settings };
        this.#storage.set({ [SettingsService.#STORAGE_KEY]: this.#settings });
    }
}
