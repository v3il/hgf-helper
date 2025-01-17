import { SettingsFacade } from '@components/shared';
// @ts-ignore
import { StreamElementsFacade } from './modules/streamElements';
// @ts-ignore
import { OffersFacade } from './modules/offers';
// @ts-ignore
import { OffersList } from './views/offer/OffersList';

export const start = () => {
    StreamElementsFacade.instance.init(async () => {
        console.clear();

        await SettingsFacade.instance.loadSettings();
        await StreamElementsFacade.instance.sortOffersByCost();
        await OffersFacade.instance.fetchHiddenOffers();

        new OffersList({
            el: StreamElementsFacade.instance.offersListEl,
            offersFacade: OffersFacade.instance,
            settingsFacade: SettingsFacade.instance
        });
    });
};
