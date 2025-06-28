export function getDefaultSettings() {
    return {
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
