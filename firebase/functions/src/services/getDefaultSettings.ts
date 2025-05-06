export function getDefaultSettings() {
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
