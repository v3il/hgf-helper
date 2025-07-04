import { StreamElementsSortOffersBy } from '../consts';

export interface ISettings {
    // Twitch
    highlightMentions: boolean;
    collectDaCoinz: boolean;
    decreaseStreamDelay: boolean;

    // Store
    offersMaxPrice: number;
    hideSoldOutOffers: boolean;
    highlightLowVolumeOffers: boolean;
    sortOffersBy: StreamElementsSortOffersBy;
    enhanceStoreHeader: boolean;
    enhanceStoreSidebar: boolean;
    hideStoreFooter: boolean;

    // Misc
    openAiApiToken: string;
}

export interface IUser {
    userName: string;
    settings: ISettings;
    hiddenOffers: string[];
}

export type GlobalSettingsKeys = keyof ISettings;

export type ISettingsEvents = {
    [K in keyof ISettings as `setting-changed:${K}`]: ISettings[K];
};
