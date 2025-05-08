import { ContainerInstance, Service } from 'typedi';
import { HiddenOffersFacade } from '@shared/modules';
import { SettingsService } from './SettingsService.svelte';
import { getDefaultSettings } from './getDefaultSettings';
import { logDev, log } from '@utils';
import { FirebaseApiService } from '../FirebaseApiService';

interface IOldSettings {
    highlightMentions: boolean;
    collectDaCoinz: boolean;
    decreaseStreamDelay: boolean;

    jsonBinUrl: string;
    jsonBinMasterKey: string;
    jsonBinAccessKey: string;
    offersMaxPrice: number;
    hideSoldOutOffers: boolean;
    highlightLowVolumeOffers: boolean;
    sortOffersBy: string;
    enhanceStoreHeader: boolean;
    enhanceStoreSidebar: boolean;
    hideStoreFooter: boolean;

    openAiApiToken: string;
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
        // await this.storage.set({
        //     'hgf-helper.settings': {
        //         "collectDaCoinz": true,
        //         "decreaseStreamDelay": true,
        //         "enhanceStoreHeader": false,
        //         "enhanceStoreSidebar": true,
        //         "hideSoldOutOffers": true,
        //         "hideStoreFooter": true,
        //         "highlightLowVolumeOffers": true,
        //         "highlightMentions": true,
        //         "hitsquadRunner": true,
        //         "jsonBinAccessKey": "$2b$10$APzMjSvSyDnwPKUlsAZiuOojTvri7gECivu23.WgW4cuvuiNNau6a",
        //         "jsonBinMasterKey": "$2a$10$KY0ybmEF7lAqnwtgcJytouZZGpAi6XEbpoasFQwofYq5lhaE0IW7S",
        //         "jsonBinUrl": "https://api.jsonbin.io/v3/b/641a25fcebd26539d092d042",
        //         "offersMaxPrice": 117877,
        //         "openAiApiToken": "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",
        //         "quizRunner": false,
        //         "sortOffersBy": "'-cost'"
        //     }
        // });

        const settings: IOldSettings = (await this.storage.get([this.storageKey]))[this.storageKey];

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
                hideStoreFooter: settings.hideStoreFooter ?? defaultSettings.hideStoreFooter,
                openAiApiToken: settings.openAiApiToken ?? defaultSettings.openAiApiToken
            });

            log('Settings migrated');
        } catch (error) {
            console.error('Error migrating settings:', error);
        }
    }

    private async migrateHiddenOffers(settings: IOldSettings) {
        try {
            const { jsonBinUrl, jsonBinMasterKey, jsonBinAccessKey } = settings;

            if (!jsonBinUrl || !jsonBinMasterKey || !jsonBinAccessKey) {
                logDev('Missing JSONBin credentials, skip');
                return;
            }

            const response = await fetch(jsonBinUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': jsonBinMasterKey,
                    'X-ACCESS_KEY': jsonBinAccessKey
                }
            });

            const { record } = await response.json();

            await this.hiddenOffersFacade.hideOffers(record.offers);

            log('Hidden offers migrated');
        } catch (error) {
            console.error('Error fetching hidden offers:', error);
        }
    }
}
