import './styles.css';
import { Offer } from './models/Offer';
import { OfferView } from './views/offer/OfferView';
// import { promisifiedSetTimeout } from '../shared/utils/promisifiedSetTimeout';

const promisifiedSetTimeout = (timeout) => new Promise((resolve) => {
    setTimeout(resolve, timeout);
});

// const a = setInterval(() => {
//     const sortDropdownEl = document.querySelector('[ng-model="vm.sortBy"]');
//
//     if (sortDropdownEl) {
//         clearInterval(a);
//
//         sortDropdownEl.click();
//
//         setTimeout(() => {
//             const aaa = document.querySelector('[value="-cost"]');
//
//             aaa.click();
//
//             document.body.click();
//         }, 100);
//     }
//
//     console.error(sortDropdownEl);
//
//     // console.error(document.querySelectorAll('.stream-store-list-item'));
// }, 1000);

const sortDropdownObserver = new MutationObserver(async () => {
    const sortDropdownEl = document.querySelector('[ng-model="vm.sortBy"]');

    if (sortDropdownEl) {
        sortDropdownObserver.disconnect();

        sortDropdownEl.click();

        await promisifiedSetTimeout(300);

        document.querySelector('[value="-cost"]')?.click();

        // await promisifiedSetTimeout(300);
        //
        // sortDropdownEl.click();
    }
});

sortDropdownObserver.observe(document.body, { childList: true });

const itemsObserver = new MutationObserver(() => {
    const offerEls = Array.from(document.querySelectorAll('.stream-store-list-item'));

    if (offerEls.length) {
        offerEls.forEach((offerEl) => {
            const gameTitleEl = offerEl.querySelector('.item-title');
            const countEl = offerEl.querySelector('.item-quantity-left span');
            const itemCostEl = offerEl.querySelector('.item-cost');

            const title = gameTitleEl.getAttribute('title').toLowerCase().trim();
            const count = countEl.textContent.toLowerCase().trim();
            const price = itemCostEl.lastChild.textContent.trim();

            const offer = Offer.create({ title, count, price });

            new OfferView({ offer, offerEl });
        });

        itemsObserver.disconnect();
    }
});

itemsObserver.observe(document.body, { childList: true });
