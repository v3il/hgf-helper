import { EventEmitter } from '@/farm/modules/shared';

export class GlobalSettingsService {
    static create() {
        return new GlobalSettingsService({ storage: chrome.storage.local });
    }

    static #STORAGE_KEY = 'hgf-helper.settings';

    static #DEFAULT_SETTINGS = {
        jsonBinUrl: '',
        jsonBinMasterKey: '',
        jsonBinAccessKey: '',
        offersMaxPrice: 600_000
    };

    #settings = {};
    #storage;
    #events;

    constructor({ storage }) {
        this.#storage = storage;
        this.#events = EventEmitter.create();
        this.#initObserver();
    }

    get settings() {
        return this.#settings;
    }

    get events() {
        return this.#events;
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

    #initObserver() {
        this.#storage.onChanged.addListener((changes) => {
            const { oldValue, newValue } = changes[GlobalSettingsService.#STORAGE_KEY];

            this.#settings = { ...newValue };

            for (const key in oldValue) {
                if (oldValue[key] !== newValue[key]) {
                    this.#events.emit(`setting-changed:${key}`, newValue[key]);
                }
            }
        });
    }
}
