export interface ISettings {
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

export interface IUser {
    settings: ISettings;
    hiddenOffers: string[];
}
