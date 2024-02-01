import { LocalSettingsService, SettingsService } from './services';

export class SettingsFacade {
    static _instance;

    static get instance() {
        if (!this._instance) {
            const localSettingsService = LocalSettingsService.create();
            const settingsService = SettingsService.create();

            this._instance = new SettingsFacade({
                localSettingsService,
                settingsService
            });
        }

        return this._instance;
    }

    #settingsService;
    #localSettingsService;

    constructor({ localSettingsService, settingsService }) {
        this.#settingsService = settingsService;
        this.#localSettingsService = localSettingsService;
    }

    async loadSettings() {
        this.#localSettingsService.loadSettings();
        await this.#settingsService.loadSettings();
    }

    getGlobalSetting(settingName) {
        return this.#settingsService.getSetting(settingName);
    }

    updateGlobalSettings(settings) {
        this.#settingsService.updateSettings(settings);
    }

    getLocalSetting(settingName) {
        return this.#localSettingsService.getSetting(settingName);
    }

    updateLocalSettings(settings) {
        this.#localSettingsService.updateSettings(settings);
    }
}
