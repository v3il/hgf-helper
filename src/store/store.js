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

    // StreamElementsFacade.instance.offerEls.forEach((offerEl) => {
    //     const gameNameEl = offerEl.querySelector('.item-title');
    //     const countEl = offerEl.querySelector('.item-quantity-left span');
    //     const itemCostEl = offerEl.querySelector('.item-cost');
    //
    //     const name = gameNameEl.getAttribute('title').toLowerCase().trim();
    //     const count = countEl.textContent.toLowerCase().trim();
    //     const price = itemCostEl.lastChild.textContent.trim();
    //
    //     new OfferView({
    //         offerEl,
    //         offer: OffersFacade.instance.createOffer({ name, count, price }),
    //         offersFacade: OffersFacade.instance
    //     });
    // });
});
