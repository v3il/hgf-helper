import { SettingsFacade } from '@/shared/settings';
import { StreamElementsFacade } from './modules/streamElements';
import { OffersFacade } from '@/store/modules/offers';
import { OfferView } from '@/store/views/offer/OfferView';

StreamElementsFacade.instance.init(async () => {
    console.clear();

    await SettingsFacade.instance.loadSettings();
    await OffersFacade.instance.fetchHiddenOffers();

    StreamElementsFacade.instance.offerEls.forEach((offerEl) => {
        const gameNameEl = offerEl.querySelector('.item-title');
        const countEl = offerEl.querySelector('.item-quantity-left span');
        const itemCostEl = offerEl.querySelector('.item-cost');

        const name = gameNameEl.getAttribute('title').toLowerCase().trim();
        const count = countEl.textContent.toLowerCase().trim();
        const price = itemCostEl.lastChild.textContent.trim();

        new OfferView({
            offerEl,
            offer: OffersFacade.instance.createOffer({ name, count, price }),
            offersFacade: OffersFacade.instance
        });
    });
});

// (async () => {
//     console.clear();
//
//     // const { SettingsFacade } = await import('../shared/settings');
//
//     // await SettingsFacade.instance.loadSettings();
//
//     await SettingsFacade.instance.loadSettings();
//
//     // await settingsService.loadSettings();
//
//     console.error('SettingsFacade.instance', SettingsFacade.instance.globalSettings);
//
//     // const jsonBinApiService = new JsonBinApiService({ settingsService });
//     // const storageService = new OffersService({ apiService: jsonBinApiService });
//     //
//     // try {
//     //     await storageService.fetchHiddenOffers();
//     // } catch (e) {
//     //     return console.error('Failed to fetch hidden offers!');
//     // }
//     //
//     // const sortDropdownObserver = new MutationObserver(() => {
//     //     const sortDropdownEl = document.querySelector('[ng-model="vm.sortBy"]');
//     //
//     //     if (sortDropdownEl) {
//     //         sortDropdownObserver.disconnect();
//     //
//     //         sortDropdownEl.click();
//     //
//     //         setTimeout(() => {
//     //             document.querySelector('[value="-cost"]')?.click();
//     //         }, 300);
//     //     }
//     // });
//     //
//     // sortDropdownObserver.observe(document.body, { childList: true });
//     //
//     // const itemsObserver = new MutationObserver(async () => {
//     //     const offerEls = Array.from(document.querySelectorAll('.stream-store-list-item'));
//     //
//     //     if (offerEls.length) {
//     //         itemsObserver.disconnect();
//     //
//     //         offerEls.forEach((offerEl) => {
//     //             const gameNameEl = offerEl.querySelector('.item-title');
//     //             const countEl = offerEl.querySelector('.item-quantity-left span');
//     //             const itemCostEl = offerEl.querySelector('.item-cost');
//     //
//     //             const name = gameNameEl.getAttribute('title').toLowerCase().trim();
//     //             const count = countEl.textContent.toLowerCase().trim();
//     //             const price = itemCostEl.lastChild.textContent.trim();
//     //
//     //             const offer = new Offer({ name, count, price });
//     //             new OfferView({ offer, offerEl, storageService });
//     //         });
//     //     }
//     // });
//     //
//     // itemsObserver.observe(document.body, { childList: true });
// })();
