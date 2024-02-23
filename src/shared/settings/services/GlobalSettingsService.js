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
        hideOffersOver: 1000000
    };

    #settings = {};
    #storage;
    #events;

    constructor({ storage }) {
        this.#storage = storage;
        this.#events = EventEmitter.create();
    }

    get events() {
        return this.#events;
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

        Object.keys(settings).forEach((key) => {
            this.#events.emit(`settings-updated:${key}`);
        });
    }
}
