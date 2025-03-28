import { Service } from 'typedi';
import { log } from '../utils';
import { EventEmitter } from '../EventEmitter';

export interface IGlobalSettings {
    highlightMentions: boolean;
    collectDaCoinz: boolean;
    decreaseStreamDelay: boolean;

    jsonBinUrl: string;
    jsonBinMasterKey: string;
    jsonBinAccessKey: string;
    offersMaxPrice: number;
    hideSoldOutOffers: boolean;
    highlightLowVolumeOffers: boolean;
    sortOffersBy: '\'order\'' | '\'-cost\'' | '\'-createdAt\'';
    enhanceStoreHeader: boolean;
    enhanceStoreSidebar: boolean;
    hideStoreFooter: boolean;

    openAiApiToken: string;
}

export type GlobalSettingsKeys = keyof IGlobalSettings;

type IGlobalSettingsEvents = {
    [K in keyof IGlobalSettings as `setting-changed:${K}`]: IGlobalSettings[K];
};

interface IParams {
    storage: chrome.storage.LocalStorageArea;
    events: EventEmitter<IGlobalSettingsEvents>;
}

@Service({ factory: () => GlobalSettingsService.create() })
export class GlobalSettingsService {
    static create() {
        return new GlobalSettingsService({
            events: EventEmitter.create<IGlobalSettingsEvents>(),
            storage: chrome.storage.local
        });
    }

    private readonly storageKey = 'hgf-helper.settings';

    readonly events;
    private readonly storage;

    private _settings: IGlobalSettings = {
        highlightMentions: true,
        collectDaCoinz: true,
        decreaseStreamDelay: true,

        jsonBinUrl: '',
        jsonBinMasterKey: '',
        jsonBinAccessKey: '',
        offersMaxPrice: 600_000,
        hideSoldOutOffers: true,
        highlightLowVolumeOffers: true,
        sortOffersBy: '\'order\'',
        enhanceStoreHeader: true,
        enhanceStoreSidebar: true,
        hideStoreFooter: true,

        openAiApiToken: ''
    };

    constructor({ storage, events }: IParams) {
        this.storage = storage;
        this.events = events;
        this.initObserver();
    }

    get settings() {
        return this._settings;
    }

    async loadSettings() {
        const settings = await this.storage.get([this.storageKey]);

        log(`Global: ${JSON.stringify(settings[this.storageKey])}`);

        this._settings = {
            ...this._settings,
            ...settings[this.storageKey]
        };
    }

    updateSettings(settings: Partial<IGlobalSettings>) {
        this._settings = { ...this._settings, ...settings };
        this.storage.set({ [this.storageKey]: this.settings });
    }

    private initObserver() {
        this.storage.onChanged.addListener((changes) => {
            const { oldValue, newValue } = changes[this.storageKey];

            this._settings = { ...newValue };

            for (const key in oldValue) {
                if (oldValue[key] !== newValue[key]) {
                    this.events.emit(`setting-changed:${key as GlobalSettingsKeys}`, newValue[key]);
                }
            }
        });
    }
}
