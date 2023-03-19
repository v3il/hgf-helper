import './styles.css';
import { Offer } from './models/Offer';
import { OfferView } from './views/offer/OfferView';
import { StorageService } from './services';

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

const storageService = new StorageService();

const itemsObserver = new MutationObserver(() => {
    const offerEls = Array.from(document.querySelectorAll('.stream-store-list-item'));

    if (offerEls.length) {
        offerEls.forEach((offerEl) => {
            const gameNameEl = offerEl.querySelector('.item-title');
            const countEl = offerEl.querySelector('.item-quantity-left span');
            const itemCostEl = offerEl.querySelector('.item-cost');

            const name = gameNameEl.getAttribute('title').toLowerCase().trim();
            const count = countEl.textContent.toLowerCase().trim();
            const price = itemCostEl.lastChild.textContent.trim();

            const offer = Offer.create({ name, count, price });

            new OfferView({ offer, offerEl, storageService });
        });

        itemsObserver.disconnect();
    }
});

itemsObserver.observe(document.body, { childList: true });
