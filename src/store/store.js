import { SettingsFacade } from '@/shared/settings';
import { StreamElementsFacade } from './modules/streamElements';
import { OffersFacade } from '@/store/modules/offers';
import { OffersList } from '@/store/views/offer/OffersList';

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
