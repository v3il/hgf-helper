import { Container, Service } from 'typedi';
import { EventHandler } from '@shared/EventEmitter';
import { GlobalSettingsKeys, ISettings, ISettingsEvents } from '../types';
import { FirebaseApiService } from '../FirebaseApiService';
import { SettingsService } from './SettingsService.svelte';
import { SettingsMigrator } from './SettingsMigrator';
import { StorageService } from '../StorageService';

@Service()
export class SettingsFacade {
    private settingsService!: SettingsService;
    private settingsMigrator!: SettingsMigrator;

    private container = Container.of('settings');

    constructor() {
        this.initProviders();
    }

    get settings() {
        return this.settingsService.settings;
    }

    setSettings(settings: ISettings) {
        return this.settingsService.setSettings(settings);
    }

    updateSettings(settings: Partial<ISettings>) {
        return this.settingsService.updateSettings(settings);
    }

    migrateOldSettings() {
        return this.settingsMigrator.migrateOldSettings();
    }

    onSettingChanged<
        K extends GlobalSettingsKeys
    >(key: K, callback: EventHandler<ISettingsEvents[`setting-changed:${K}`]>) {
        return this.settingsService.events.on(`setting-changed:${key}`, callback);
    }

    private initProviders() {
        this.container.set({ id: StorageService, value: Container.get(StorageService) });
        this.container.set({ id: SettingsService, type: SettingsService });
        this.container.set({ id: SettingsMigrator, type: SettingsMigrator });
        this.container.set({ id: FirebaseApiService, value: Container.get(FirebaseApiService) });

        this.settingsService = this.container.get(SettingsService);
        this.settingsMigrator = this.container.get(SettingsMigrator);
    }
}
