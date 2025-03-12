import { Container, ContainerInstance } from 'typedi';
import {
    LocalSettingsService, GlobalSettingsService, ILocalSettings, IGlobalSettings
} from './services';
import { BasicFacade } from '../BasicFacade';

export class SettingsFacade extends BasicFacade {
    static container = Container.of('settings');

    static providers = [
        { id: LocalSettingsService, factory: () => LocalSettingsService.create() },
        { id: GlobalSettingsService, factory: () => GlobalSettingsService.create() }
    ];

    private readonly globalSettingsService!: GlobalSettingsService;
    private readonly localSettingsService!: LocalSettingsService;

    static get instance(): SettingsFacade {
        return super.instance;
    }

    constructor(container: ContainerInstance) {
        super();

        this.globalSettingsService = container.get(GlobalSettingsService);
        this.localSettingsService = container.get(LocalSettingsService);
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
