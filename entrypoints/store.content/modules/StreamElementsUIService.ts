import { wait } from '@utils';
import { Container, Service } from 'typedi';
import { StreamElementsSortOffersBy, Timing } from '@shared/consts';
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
            if (this.sortOffersDropdownEl && this.offerEls.length > 0) {
                clearInterval(interval);
                callback();
            }
        }, Timing.SECOND);
    }

    get userPublicStoreEl() {
        return document.querySelector<HTMLElement>('user-public-store')!;
    }

    get offerEls() {
        return this.userPublicStoreEl.querySelectorAll<HTMLElement>('div:last-child > div')!;
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
        const order = new URL(location.href).searchParams.get('order') ?? StreamElementsSortOffersBy.DEFAULT;

        if (sortOffersBy === order) {
            return;
        }

        this.activateComboboxElement(this.sortOffersDropdownEl!)

        await wait(100);

        const optionEls = document.querySelectorAll<HTMLElement>('[role="listbox"][data-state="open"] [role="option"]');

        const optionIndex = {
            [StreamElementsSortOffersBy.DEFAULT]: 0,
            [StreamElementsSortOffersBy.CREATED_AT]: 1,
            [StreamElementsSortOffersBy.SUBSCRIBERS_ONLY]: 2,
            [StreamElementsSortOffersBy.COST]: 3
        }[sortOffersBy] ?? 0;

        this.activateComboboxElement(optionEls[optionIndex]!);
    }

    private activateComboboxElement(element: HTMLElement) {
        const event = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true
        });

        element.dispatchEvent(event);
    }

    private initSettingsObserver() {
        this.settingsFacade.onSettingChanged('enhanceStoreHeader', () => this.enhanceStoreHeader());
        this.settingsFacade.onSettingChanged('enhanceStoreSidebar', () => this.enhanceStoreSidebar());
        this.settingsFacade.onSettingChanged('hideStoreFooter', () => this.toggleStoreFooter());
        this.settingsFacade.onSettingChanged('sortOffersBy', () => this.sortOffers());
    }

    private get sortOffersDropdownEl() {
        return this.userPublicStoreEl.querySelector<HTMLElement>('div:nth-child(2) button[role="combobox"]:last-child');
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
