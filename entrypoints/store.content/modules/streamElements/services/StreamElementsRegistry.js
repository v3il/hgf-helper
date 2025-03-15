import { promisifiedSetTimeout } from '../../../../../components/utils';

export class StreamElementsRegistry {
    onElementsReady(callback) {
        const interval = setInterval(() => {
            const offerEls = document.querySelectorAll('.stream-store-list-item');

            if (this.#sortOffersDropdownEl && offerEls.length > 0) {
                clearInterval(interval);
                callback();
            }
        }, 500);
    }

    get #sortOffersDropdownEl() {
        return document.querySelector('[ng-model="vm.sortBy"]');
    }

    get offersListEl() {
        return document.querySelector('.public-store-items');
    }

    // todo
    async sortOffersByCost() {
        this.#sortOffersDropdownEl.click();
        await promisifiedSetTimeout(300);
        document.querySelector('[value="-cost"]')?.click();
    }
}
