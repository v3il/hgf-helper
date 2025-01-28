import {
    LocalSettingsService, GlobalSettingsService, ILocalSettings, IGlobalSettings, GlobalSettingsKeys
} from './services';

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

    private readonly globalSettingsService;
    private readonly localSettingsService;

    constructor({ localSettingsService, globalSettingsService }: ISettingsFacadeParams) {
        this.globalSettingsService = globalSettingsService;
        this.localSettingsService = localSettingsService;
    }

    get globalSettings() {
        return this.globalSettingsService.settings;
    }

    get globalSettingsEvents() {
        return this.globalSettingsService.events;
    }

    async loadSettings() {
        this.localSettingsService.loadSettings();
        await this.globalSettingsService.loadSettings();
    }

    updateGlobalSettings(settings: Partial<IGlobalSettings>) {
        this.globalSettingsService.updateSettings(settings);
    }

    get localSettings() {
        return this.localSettingsService.settings;
    }

    updateLocalSettings(settings: Partial<ILocalSettings>) {
        this.localSettingsService.updateSettings(settings);
    }
}
