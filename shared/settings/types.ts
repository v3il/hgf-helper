export interface ISettings {
    // Mini-games
    hitsquad: boolean;
    hitsquadRounds: number;
    akiraDrawing: boolean;
    chestGame: boolean;
    lootGame: boolean;

    // Twitch
    highlightMentions: boolean;
    collectDaCoinz: boolean;
    decreaseStreamDelay: boolean;

    // Store
    // jsonBinUrl: string;
    // jsonBinMasterKey: string;
    // jsonBinAccessKey: string;
    offersMaxPrice: number;
    hideSoldOutOffers: boolean;
    highlightLowVolumeOffers: boolean;
    sortOffersBy: string;
    enhanceStoreHeader: boolean;
    enhanceStoreSidebar: boolean;
    hideStoreFooter: boolean;

    // Misc
    openAiApiToken: string;
}

export interface IUser {
    settings: ISettings;
    hiddenOffers: string[];
}
