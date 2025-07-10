export interface ISettings {
    // Twitch
    highlightMentions: boolean;
    collectDaCoinz: boolean;
    decreaseStreamDelay: boolean;

    // Store
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

export function getDefaultSettings(): ISettings {
    return {
        // Twitch
        highlightMentions: true,
        collectDaCoinz: true,
        decreaseStreamDelay: true,

        // Store
        offersMaxPrice: 999_999,
        hideSoldOutOffers: true,
        highlightLowVolumeOffers: true,
        sortOffersBy: 'order',
        enhanceStoreHeader: true,
        enhanceStoreSidebar: true,
        hideStoreFooter: true,

        // Misc
        openAiApiToken: ''
    };
}
