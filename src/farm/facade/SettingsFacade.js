import { Container } from 'typedi';
import { LocalSettingsService, SettingsService } from '../services';

export class SettingsFacade {
    static create() {
        const container = Container.of('settings');

        container.set([
            { id: SettingsService, factory: () => SettingsService.create() },
            { id: LocalSettingsService, factory: () => LocalSettingsService.create() }
        ]);

        return new SettingsFacade({ container });
    }

    #settingsService;
    #localSettingsService;

    constructor({ container }) {
        this.#settingsService = container.get(SettingsService);
        this.#localSettingsService = container.get(LocalSettingsService);
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
