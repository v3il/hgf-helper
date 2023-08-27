export class SettingsService {
    static #LOCAL_SETTINGS = {
        hitsquadRunner: false,
        quizRunner: false
    };

    static #SYNC_SETTINGS = {
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
        // this.#loadSettings();
    }

    get settings() {
        return this.#settings;
    }

    async loadSettings() {
        // eslint-disable-next-line no-undef
        const r = await chrome.storage.sync.get(['test']);

        console.error(r);

        // const value = this.#storage.getItem(SettingsService.#STORAGE_KEY);
        //
        // if (!value) {
        //     this.#settings = SettingsService.#DEFAULT_SETTINGS;
        //     return this.#saveSettings();
        // }

        this.#settings = { ...SettingsService.#LOCAL_SETTINGS };
    }

    getSetting(name) {
        return false; // this.#settings[name];
    }

    setSetting(name, value) {
        this.#settings[name] = value;
        this.#saveSettings();
    }

    #saveSettings() {
        // this.#storage.setItem(SettingsService.#STORAGE_KEY, JSON.stringify(this.#settings));
    }
}
