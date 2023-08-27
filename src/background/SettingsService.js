const browser = chrome;

export class SettingsService {
    static #LOCAL_SETTINGS = {
        hitsquadRunner: false,
        quizRunner: false
    };

    static #SYNC_SETTINGS = {
        jsonBinUrl: '',
        jsonBinMasterKey: '',
        jsonBinAccessKey: ''
    };

    static create() {
        return new SettingsService();
    }

    #syncSettings;
    #localSettings;

    get settings() {
        return { ...this.#localSettings, ...this.#syncSettings };
    }

    async loadSettings() {
        const localSettings = await this.#loadLocalSettings();
        const syncSettings = await this.#loadSyncSettings();

        this.#localSettings = { ...SettingsService.#LOCAL_SETTINGS, ...localSettings };
        this.#syncSettings = { ...SettingsService.#SYNC_SETTINGS, ...syncSettings };
    }

    async #loadLocalSettings() {
        return browser.storage.local.get(Object.keys(SettingsService.#LOCAL_SETTINGS));
    }

    async #loadSyncSettings() {
        return browser.storage.sync.get(Object.keys(SettingsService.#SYNC_SETTINGS));
    }

    updateSetting(name, value) {
        name in SettingsService.#LOCAL_SETTINGS
            ? this.#saveLocalSettings(name, value)
            : this.#saveSyncSettings(name, value);
    }

    #saveLocalSettings(name, value) {
        this.#localSettings[name] = value;
        browser.storage.local.set(this.#localSettings);
    }

    #saveSyncSettings(name, value) {
        this.#syncSettings[name] = value;
        browser.storage.sync.set(this.#syncSettings);
    }
}
