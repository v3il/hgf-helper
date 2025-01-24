// @ts-ignore
import { LocalSettingsService, GlobalSettingsService } from './services';

interface ISettingsFacadeParams {
    localSettingsService: LocalSettingsService;
    globalSettingsService: GlobalSettingsService;
}

export class SettingsFacade {
    private static _instance: SettingsFacade;

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

    constructor({ localSettingsService, globalSettingsService }: ISettingsFacadeParams) {
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

    getGlobalSetting(settingName: string) {
        return this.#globalSettingsService.getSetting(settingName);
    }

    updateGlobalSettings(settings: Record<string, string | number | boolean>) {
        this.#globalSettingsService.updateSettings(settings);
    }

    onGlobalSettingChanged(settingName: string, callback: (data: object) => void) {
        this.#globalSettingsService.events.on(`setting-changed:${settingName}`, callback);
    }

    getLocalSetting(settingName: string) {
        return this.#localSettingsService.getSetting(settingName);
    }

    updateLocalSettings(settings: Record<string, string | number | boolean>) {
        this.#localSettingsService.updateSettings(settings);
    }
}
