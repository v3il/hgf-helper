import { Offer } from './models/Offer';
import { OfferView } from './views/offer/OfferView';
import { StorageService, JsonBinApiService } from './services';

(async () => {
    console.clear();

    const shared = await import(chrome.runtime.getURL('dist/shared.js'));

    console.error(shared);

    const settingsService = new shared.S();

    await settingsService.loadSettings();

    console.info('Settings:', settingsService.settings);

    const jsonBinApiService = new JsonBinApiService({ settingsService });
    const storageService = new StorageService({ apiService: jsonBinApiService });

    try {
        await storageService.fetchHiddenOffers();
    } catch (e) {
        return console.error('Failed to fetch hidden offers!');
    }

    const sortDropdownObserver = new MutationObserver(() => {
        const sortDropdownEl = document.querySelector('[ng-model="vm.sortBy"]');

        if (sortDropdownEl) {
            sortDropdownObserver.disconnect();

            sortDropdownEl.click();

            setTimeout(() => {
                document.querySelector('[value="-cost"]')?.click();
            }, 300);
        }
    });

    sortDropdownObserver.observe(document.body, { childList: true });

    const itemsObserver = new MutationObserver(async () => {
        const offerEls = Array.from(document.querySelectorAll('.stream-store-list-item'));

        if (offerEls.length) {
            itemsObserver.disconnect();

            offerEls.forEach((offerEl) => {
                const gameNameEl = offerEl.querySelector('.item-title');
                const countEl = offerEl.querySelector('.item-quantity-left span');
                const itemCostEl = offerEl.querySelector('.item-cost');

                const name = gameNameEl.getAttribute('title').toLowerCase().trim();
                const count = countEl.textContent.toLowerCase().trim();
                const price = itemCostEl.lastChild.textContent.trim();

                const offer = new Offer({ name, count, price });
                new OfferView({ offer, offerEl, storageService });
            });
        }
    });

    itemsObserver.observe(document.body, { childList: true });
})();
