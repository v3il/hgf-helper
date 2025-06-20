import { ContainerInstance } from 'typedi';
import { EventEmitter } from '@shared/EventEmitter';
import { GlobalSettingsKeys, ISettings, ISettingsEvents } from '../types';
import { FirebaseApiService } from '../FirebaseApiService';
import { getDefaultSettings } from './getDefaultSettings';
import { StorageService } from '@shared/modules/StorageService';

export class SettingsService {
    private readonly apiService: FirebaseApiService;
    private readonly storageService: StorageService;

    private _settings: ISettings = $state(getDefaultSettings());

    readonly events = EventEmitter.create<ISettingsEvents>();

    constructor(container: ContainerInstance) {
        this.storageService = container.get(StorageService);
        this.apiService = container.get(FirebaseApiService);

        this.initObserver();
    }

    get settings() {
        return this._settings;
    }

    async setSettings(settings: Partial<ISettings>) {
        this._settings = { ...getDefaultSettings(), ...settings };
        await this.storageService.updateData({ settings: this.settings });
    }

    async updateSettings(settings: Partial<ISettings>) {
        this._settings = { ...this._settings, ...settings };

        await this.storageService.updateData({ settings: this.settings });
        await this.apiService.updateSettings(this.settings);
    }

    private initObserver() {
        this.storageService.onDataChanged(async (changes) => {
            const updatedSettings: Partial<ISettings> = changes!.settings ?? {};

            this._settings = { ...this._settings, ...updatedSettings };

            Object.entries(updatedSettings).forEach(([key, value]) => {
                this.events.emit(`setting-changed:${key as GlobalSettingsKeys}`, value);
            });
        });
    }
}
