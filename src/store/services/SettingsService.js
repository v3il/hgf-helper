export class SettingsService {
    static create() {
        return new SettingsService({ storage: chrome.storage.local });
    }

    static #DEFAULT_SETTINGS = {
        hitsquadRunner: false,
        quizRunner: false,
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
        const settings = await this.#storage.get(Object.keys(SettingsService.#DEFAULT_SETTINGS));
        this.#settings = { ...SettingsService.#DEFAULT_SETTINGS, ...settings };
    }

    updateSettings(settings) {
        this.#settings = { ...this.#settings, ...settings };
        this.#storage.set(this.#settings);
    }
}
