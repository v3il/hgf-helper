import { waitAsync } from '@components/utils';
import { Container, Service } from 'typedi';
import { Timing } from '@components/consts';
import { SettingsFacade } from '@shared/modules';

@Service()
export class StreamElementsUIService {
    private readonly settingsFacade: SettingsFacade;

    constructor() {
        this.settingsFacade = Container.get(SettingsFacade);
        this.initSettingsObserver();
    }

    onLayoutRendered(callback: () => void) {
        const interval = setInterval(() => {
            if (this.pageContentEl) {
                clearInterval(interval);
                callback();
            }
        }, 0.5 * Timing.SECOND);
    }

    whenOffersLoaded(callback: () => void) {
        const interval = setInterval(async () => {
            const offerEls = document.querySelectorAll('.stream-store-list-item');

            if (this.sortOffersDropdownEl && this.userStatsEl && offerEls.length > 0) {
                clearInterval(interval);
                callback();
            }
        }, Timing.SECOND);
    }

    get offersListEl() {
        return document.querySelector<HTMLElement>('.public-store-items')!;
    }

    get userStatsEl() {
        return document.querySelector<HTMLElement>('.usr-stats')!;
    }

    get pageContentEl() {
        return document.querySelector<HTMLElement>('.page-contents');
    }

    enhanceStorePage() {
        this.enhanceStoreHeader();
        this.enhanceStoreSidebar();
        this.toggleStoreFooter();
    }

    async sortOffers() {
        const field = this.settingsFacade.settings.sortOffersBy;

        if (field === '\'order\'') {
            return;
        }

        this.sortOffersDropdownEl!.click();
        await waitAsync(300);

        const optionsContainerId = this.sortOffersDropdownEl!.getAttribute('aria-owns');
        const options = document.querySelectorAll<HTMLButtonElement>(`#${optionsContainerId} md-option`);

        for (const option of options) {
            if (option.getAttribute('ng-value') === field) {
                option.click();
                break;
            }
        }

        setTimeout(() => {
            document.querySelector<HTMLDivElement>('.md-select-backdrop')?.click();
        }, 500);
    }

    private initSettingsObserver() {
        this.settingsFacade.onSettingChanged('enhanceStoreHeader', () => this.enhanceStoreHeader());
        this.settingsFacade.onSettingChanged('enhanceStoreSidebar', () => this.enhanceStoreSidebar());
        this.settingsFacade.onSettingChanged('hideStoreFooter', () => this.toggleStoreFooter());
    }

    private get sortOffersDropdownEl() {
        return document.querySelector<HTMLButtonElement>('[ng-model="vm.sortBy"]');
    }

    private enhanceStoreHeader() {
        document.documentElement.classList
            .toggle('hgf-enhanced-header', this.settingsFacade.settings.enhanceStoreHeader);
    }

    private enhanceStoreSidebar() {
        document.documentElement.classList
            .toggle('hgf-enhanced-sidebar', this.settingsFacade.settings.enhanceStoreSidebar);
    }

    private toggleStoreFooter() {
        document.documentElement.classList
            .toggle('hgf-hide-footer', this.settingsFacade.settings.hideStoreFooter);
    }
}
