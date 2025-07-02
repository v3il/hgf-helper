import { ISettings } from '../types';
import { StreamElementsSortOffersBy } from '../../consts';

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
        sortOffersBy: StreamElementsSortOffersBy.DEFAULT,
        enhanceStoreHeader: true,
        enhanceStoreSidebar: true,
        hideStoreFooter: true,

        // Misc
        openAiApiToken: ''
    };
}
