export class SettingsService {
    static #DEFAULT_SETTINGS = {
        hitsquadRunner: false,
        quizRunner: false
    };

    constructor() {
        console.error(1);
        this.#loadSettings();
    }

    async #loadSettings() {
        // eslint-disable-next-line no-undef
        const r = await chrome.storage.sync.get(['test']);

        console.error('loaded', r);
    }

    getSetting(name) {
        console.error(2);
    }

    setSetting(name, value) {
        console.error(3);
    }
}

// static #STORAGE_KEY = 'hgf-helper-settings';
//
// static #DEFAULT_SETTINGS = {
//     hitsquadRunner: false,
//     quizRunner: false
// };
//
// static create(storage) {
//     return new SettingsService(storage);
// }
//
// #storage;
// #settings;
//
// constructor(storage) {
//     this.#storage = storage;
//     this.#loadSettings();
//
//     // eslint-disable-next-line no-undef
//     console.error(chrome.runtime);
// }
//
// #loadSettings() {
//     const value = this.#storage.getItem(SettingsService.#STORAGE_KEY);
//
//     if (!value) {
//         this.#settings = SettingsService.#DEFAULT_SETTINGS;
//         return this.#saveSettings();
//     }
//
//     this.#settings = { ...SettingsService.#DEFAULT_SETTINGS, ...JSON.parse(value) };
// }
//
// getSetting(name) {
//     return this.#settings[name];
// }
//
// setSetting(name, value) {
//     this.#settings[name] = value;
//     this.#saveSettings();
// }
//
// #saveSettings() {
//     this.#storage.setItem(SettingsService.#STORAGE_KEY, JSON.stringify(this.#settings));
// }
