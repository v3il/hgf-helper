export class LocalSettingsService {
    static create() {
        return new LocalSettingsService({ storage: window.localStorage });
    }

    static #STORAGE_KEY = 'hgf-helper.settings';

    static #DEFAULT_SETTINGS = {
        hitsquadRunner: false,
        hitsquadRunnerRemainingRounds: 0,
        quizRunner: false
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

    loadSettings() {
        const settings = this.#storage.getItem(LocalSettingsService.#STORAGE_KEY);

        if (!settings) {
            this.#settings = { ...LocalSettingsService.#DEFAULT_SETTINGS };
            return;
        }

        try {
            this.#settings = { ...LocalSettingsService.#DEFAULT_SETTINGS, ...JSON.parse(settings) };
        } catch (e) {
            this.#settings = { ...LocalSettingsService.#DEFAULT_SETTINGS };
        }
    }

    updateSettings(settings) {
        this.#settings = { ...this.#settings, ...settings };
        this.#storage.setItem(LocalSettingsService.#STORAGE_KEY, JSON.stringify(this.#settings));
    }
}
