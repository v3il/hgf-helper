import { wait } from '@utils';
import { Container, Service } from 'typedi';
import { Timing } from '@shared/consts';
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
            if (this.pageContentEl && this.sidebarEl) {
                clearInterval(interval);
                callback();
            }
        }, 0.5 * Timing.SECOND);
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

    get offersListEl() {
        return document.querySelector<HTMLElement>('.public-store-items')!;
    }

    get sidebarEl() {
        return document.querySelector<HTMLElement>('.side-bar')!;
    }

    get pageContentEl() {
        return document.querySelector<HTMLElement>('.page-contents');
    }

    enhanceStorePage() {
        this.enhanceStoreHeader();
        this.enhanceStoreSidebar();
        this.toggleStoreFooter();
    }

    removeStorePageEnhancements() {
        document.documentElement.classList.remove('hgf-enhanced-header');
        document.documentElement.classList.remove('hgf-enhanced-sidebar');
        document.documentElement.classList.remove('hgf-hide-footer');
    }

    async sortOffers() {
        const { sortOffersBy } = this.settingsFacade.settings;

        this.sortOffersDropdownEl!.click();
        await wait(300);

        const backdropEl = document.querySelector<HTMLElement>('.md-select-backdrop');
        const optionsContainerId = this.sortOffersDropdownEl!.getAttribute('aria-owns');
        const options = document.querySelectorAll<HTMLOptionElement>(`#${optionsContainerId} md-option`);
        const selectedOption = Array.from(options).find((option) => option.hasAttribute('selected'));
        const currentSort = selectedOption?.getAttribute('ng-value');

        if (currentSort === sortOffersBy) {
            backdropEl?.click();
            return;
        }

        for (const option of options) {
            if (option.getAttribute('ng-value') === sortOffersBy) {
                option.click();
                break;
            }
        }

        setTimeout(() => {
            backdropEl?.click();
        }, 500);
    }

    private initSettingsObserver() {
        this.settingsFacade.onSettingChanged('enhanceStoreHeader', () => this.enhanceStoreHeader());
        this.settingsFacade.onSettingChanged('enhanceStoreSidebar', () => this.enhanceStoreSidebar());
        this.settingsFacade.onSettingChanged('hideStoreFooter', () => this.toggleStoreFooter());
        this.settingsFacade.onSettingChanged('sortOffersBy', () => this.sortOffers());
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
