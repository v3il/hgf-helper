// import { settingsService } from '../../shared';

// eslint-disable-next-line no-undef
// const src = chrome.runtime.getURL('../shared/SettingsService.js');
// const contentMain = await import(src);
//
// console.error(contentMain);

// const a = async () => {
//     // eslint-disable-next-line no-undef
//     console.error(chrome.runtime.id);
//     // eslint-disable-next-line no-undef
//     return chrome.runtime.sendMessage({ greeting: 'hello' });
// };

// import { Actions } from '../../shared';

export class SettingsService {
    static #STORAGE_KEY = 'hgf-helper-settings';

    static #DEFAULT_SETTINGS = {
        hitsquadRunner: false,
        quizRunner: false
    };

    static create(storage) {
        return new SettingsService(storage);
    }

    #storage = {};
    #settings = {};

    constructor(storage) {
        // console.error('content', Actions);

        this.#storage = storage;
        // this.#loadSettings();

        // a().then(console.error);

        // settingsService.getSetting('test');
    }

    async loadSettings() {
        console.error('loadSettings');

        // eslint-disable-next-line no-undef
        const settings = await chrome.runtime.sendMessage({ greeting: 'hello' });

        console.error(2, settings);

        // const value = this.#storage.getItem(SettingsService.#STORAGE_KEY);
        //
        // if (!value) {
        //     this.#settings = SettingsService.#DEFAULT_SETTINGS;
        //     return this.#saveSettings();
        // }
        //
        // this.#settings = { ...SettingsService.#DEFAULT_SETTINGS, ...JSON.parse(value) };
    }

    getSetting(name) {
        return this.#settings[name];
    }

    setSetting(name, value) {
        // this.#settings[name] = value;
        // this.#saveSettings();
    }

    #saveSettings() {
        this.#storage.setItem(SettingsService.#STORAGE_KEY, JSON.stringify(this.#settings));
    }
}
