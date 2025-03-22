import { waitAsync } from '@components/utils';
import { Container, Service } from 'typedi';
import { Timing } from '@components/consts';
import { GlobalSettingsService } from '@components/settings';

@Service()
export class StreamElementsUIService {
    private readonly globalSettingsService: GlobalSettingsService;

    constructor() {
        this.globalSettingsService = Container.get(GlobalSettingsService);
    }

    whenOffersLoaded(callback: () => void) {
        const interval = setInterval(async () => {
            const offerEls = document.querySelectorAll('.stream-store-list-item');

            if (this.sortOffersDropdownEl && offerEls.length > 0) {
                clearInterval(interval);
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

    async prepareStorePage() {
        await this.sortOffers();
    }

    private async sortOffers() {
        const field = this.globalSettingsService.settings.sortOffersBy;

        if (field === '\'order\'') {
            return;
        }

        this.sortOffersDropdownEl!.click();
        await waitAsync(300);

        const optionsContainerId = this.sortOffersDropdownEl!.getAttribute('aria-owns');
        const options = document.querySelectorAll<HTMLButtonElement>(`#${optionsContainerId} md-option`);

        options.forEach((option) => {
            if (option.getAttribute('ng-value') === field) {
                option.click();
            }
        });

        document.querySelector<HTMLDivElement>('.md-select-backdrop')?.click();
    }
}
