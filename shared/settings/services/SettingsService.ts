import { ContainerInstance } from 'typedi';
import { ISettings } from '@shared/settings';
import { EventEmitter } from '@components/EventEmitter';
import { UserApiService } from './UserApiService';

export type GlobalSettingsKeys = keyof ISettings;

export type ISettingsEvents = {
    [K in keyof ISettings as `setting-changed:${K}`]: ISettings[K];
};

export class SettingsService {
    private readonly apiService: UserApiService;

    private _settings: ISettings;

    readonly events = EventEmitter.create<ISettingsEvents>();

    private readonly settingsKey = 'hgf-helper.settings';
    private readonly storage = chrome.storage.local;

    constructor(container: ContainerInstance) {
        this._settings = this.getDefaultSettings();
        this.apiService = container.get(UserApiService);

        this.initObserver();
    }

    get settings() {
        return this._settings;
    }

    async setSettings(settings: Partial<ISettings>) {
        this._settings = { ...this.getDefaultSettings(), ...settings };
        await this.storage.set({ [this.settingsKey]: this.settings });
    }

    async updateSettings(settings: Partial<ISettings>) {
        this._settings = { ...this._settings, ...settings };

        await this.storage.set({ [this.settingsKey]: this.settings });
        await this.apiService.updateSettings(this.settings);
    }

    private initObserver() {
        this.storage.onChanged.addListener((changes) => {
            const { oldValue, newValue } = changes[this.settingsKey];

            this._settings = { ...newValue };

            for (const key in oldValue) {
                if (oldValue[key] !== newValue[key]) {
                    this.events.emit(`setting-changed:${key as GlobalSettingsKeys}`, newValue[key]);
                }
            }
        });
    }

    private getDefaultSettings(): ISettings {
        return {
            // Mini-games
            hitsquad: false,
            hitsquadRounds: 0,
            akiraDrawing: false,
            chestGame: false,
            lootGame: false,

            // Twitch
            highlightMentions: true,
            collectDaCoinz: true,
            decreaseStreamDelay: true,

            // Store
            offersMaxPrice: 999_999,
            hideSoldOutOffers: true,
            highlightLowVolumeOffers: true,
            sortOffersBy: '\'order\'',
            enhanceStoreHeader: true,
            enhanceStoreSidebar: true,
            hideStoreFooter: true,

            // Misc
            openAiApiToken: ''
        };
    }
}
