// import { settingsService } from '../../shared';

const a = async () => {
    // eslint-disable-next-line no-undef
    console.error(chrome.runtime.id);
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ greeting: 'hello' });
};

export class SettingsService {
    static #STORAGE_KEY = 'hgf-helper-settings';

    static #DEFAULT_SETTINGS = {
        hitsquadRunner: false,
        quizRunner: false
    };

    static create(storage) {
        return new SettingsService(storage);
    }

    #storage;
    #settings;

    constructor(storage) {
        this.#storage = storage;
        this.#loadSettings();

        a().then(console.error);

        // settingsService.getSetting('test');
    }

    #loadSettings() {
        const value = this.#storage.getItem(SettingsService.#STORAGE_KEY);

        if (!value) {
            this.#settings = SettingsService.#DEFAULT_SETTINGS;
            return this.#saveSettings();
        }

        this.#settings = { ...SettingsService.#DEFAULT_SETTINGS, ...JSON.parse(value) };
    }

    getSetting(name) {
        return this.#settings[name];
    }

    setSetting(name, value) {
        this.#settings[name] = value;
        this.#saveSettings();
    }

    #saveSettings() {
        this.#storage.setItem(SettingsService.#STORAGE_KEY, JSON.stringify(this.#settings));
    }
}
