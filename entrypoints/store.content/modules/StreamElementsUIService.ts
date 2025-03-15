import { promisifiedSetTimeout } from '@components/utils';
import { Service } from 'typedi';
import { Timing } from '@components/consts';

@Service()
export class StreamElementsUIService {
    whenOffersLoaded(callback: () => void) {
        const interval = setInterval(async () => {
            const offerEls = document.querySelectorAll('.stream-store-list-item');

            if (this.sortOffersDropdownEl && offerEls.length > 0) {
                clearInterval(interval);
                await this.sortOffersByCost();
                callback();
            }
        }, Timing.SECOND);
    }

    private get sortOffersDropdownEl() {
        return document.querySelector<HTMLButtonElement>('[ng-model="vm.sortBy"]');
    }

    get offersListEl() {
        return document.querySelector<HTMLElement>('.public-store-items')!;
    }

    private async sortOffersByCost() {
        this.sortOffersDropdownEl?.click();
        await promisifiedSetTimeout(300);
        document.querySelector<HTMLButtonElement>('[value="-cost"]')?.click();
    }
}
