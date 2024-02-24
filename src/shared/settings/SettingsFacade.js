import { LocalSettingsService, GlobalSettingsService } from './services';

export class SettingsFacade {
    static _instance;

    static get instance() {
        if (!this._instance) {
            const localSettingsService = LocalSettingsService.create();
            const globalSettingsService = GlobalSettingsService.create();

            this._instance = new SettingsFacade({
                localSettingsService,
                globalSettingsService
            });
        }

        return this._instance;
    }

    #globalSettingsService;
    #localSettingsService;

    constructor({ localSettingsService, globalSettingsService }) {
        this.#globalSettingsService = globalSettingsService;
        this.#localSettingsService = localSettingsService;
    }

    get globalSettings() {
        return this.#globalSettingsService.settings;
    }

    async loadSettings() {
        this.#localSettingsService.loadSettings();
        await this.#globalSettingsService.loadSettings();
    }

    getGlobalSetting(settingName) {
        return this.#globalSettingsService.getSetting(settingName);
    }

    updateGlobalSettings(settings) {
        this.#globalSettingsService.updateSettings(settings);
    }

    onGlobalSettingChanged(settingName, callback) {
        this.#globalSettingsService.events.on(`setting-changed:${settingName}`, callback);
    }

    getLocalSetting(settingName) {
        return this.#localSettingsService.getSetting(settingName);
    }

    updateLocalSettings(settings) {
        this.#localSettingsService.updateSettings(settings);
    }
}
