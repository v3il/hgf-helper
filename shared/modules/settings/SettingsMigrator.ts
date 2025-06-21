import { ContainerInstance, Service } from 'typedi';
import { HiddenOffersFacade } from '@shared/modules';
import { SettingsService } from './SettingsService.svelte';
import { getDefaultSettings } from './getDefaultSettings';
import { logDev, log } from '@utils';
import { FirebaseApiService } from '../FirebaseApiService';
import { FUNCTION_URL } from '@shared/consts';

interface IOldSettings {
    highlightMentions: boolean;
    collectDaCoinz: boolean;
    decreaseStreamDelay: boolean;

    jsonBinUrl: string;
    jsonBinMasterKey: string;
    offersMaxPrice: number;
    hideSoldOutOffers: boolean;
    highlightLowVolumeOffers: boolean;
    sortOffersBy: string;
    enhanceStoreHeader: boolean;
    enhanceStoreSidebar: boolean;
    hideStoreFooter: boolean;
}

@Service()
export class SettingsMigrator {
    private readonly storageKey = 'hgf-helper.settings';
    private readonly storage = chrome.storage.local;

    private readonly hiddenOffersFacade: HiddenOffersFacade;
    private readonly settingsService: SettingsService;
    private readonly apiService: FirebaseApiService;

    constructor(container: ContainerInstance) {
        this.hiddenOffersFacade = container.get(HiddenOffersFacade);
        this.settingsService = container.get(SettingsService);
        this.apiService = container.get(FirebaseApiService);
    }

    async migrateOldSettings() {
        const settings: IOldSettings = (await this.storage.get([this.storageKey]))[this.storageKey];

        if (!settings || Object.keys(settings).length === 0) {
            logDev('No settings to migrate');
            await this.apiService.markSettingsMigrated();
            return;
        }

        await this.migrateSettings(settings);
        await this.migrateHiddenOffers(settings);
        await this.apiService.markSettingsMigrated();
    }

    private async migrateSettings(settings: IOldSettings) {
        try {
            const defaultSettings = getDefaultSettings();

            await this.settingsService.updateSettings({
                highlightMentions: settings.highlightMentions ?? defaultSettings.highlightMentions,
                collectDaCoinz: settings.collectDaCoinz ?? defaultSettings.collectDaCoinz,
                decreaseStreamDelay: settings.decreaseStreamDelay ?? defaultSettings.decreaseStreamDelay,
                offersMaxPrice: settings.offersMaxPrice ?? defaultSettings.offersMaxPrice,
                hideSoldOutOffers: settings.hideSoldOutOffers ?? defaultSettings.hideSoldOutOffers,
                highlightLowVolumeOffers: settings.highlightLowVolumeOffers ?? defaultSettings.highlightLowVolumeOffers,
                sortOffersBy: settings.sortOffersBy ?? defaultSettings.sortOffersBy,
                enhanceStoreHeader: settings.enhanceStoreHeader ?? defaultSettings.enhanceStoreHeader,
                enhanceStoreSidebar: settings.enhanceStoreSidebar ?? defaultSettings.enhanceStoreSidebar,
                hideStoreFooter: settings.hideStoreFooter ?? defaultSettings.hideStoreFooter
            });

            log('Settings migrated');
        } catch (error) {
            console.error('Error migrating settings:', error);
        }
    }

    private async migrateHiddenOffers(settings: IOldSettings) {
        try {
            const { jsonBinUrl, jsonBinMasterKey } = settings;

            if (!jsonBinUrl || !jsonBinMasterKey) {
                logDev('Missing JSONBin credentials, skip');
                return;
            }

            const response = await this.apiService.sendRequest<{ record: { offers: string[] } }>(jsonBinUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': jsonBinMasterKey
                }
            });

            if (response.error) {
                console.error('Error fetching hidden offers:', response.error);
                return;
            }

            const offers = response.data!.record.offers;

            await this.hiddenOffersFacade.hideOffers(offers);

            log('Hidden offers migrated');
        } catch (error) {
            console.error('Error fetching hidden offers:', error);
        }
    }
}
