import { OffersFacade, StreamElementsUIService } from '@store/modules';
import { debounce } from '@utils';
import { Container } from 'typedi';
import { BasicView } from '@shared/views';
import template from './template.html?raw';
import './style.css';

export class HiddenOffersManager extends BasicView {
    private readonly offersFacade;
    private readonly streamElementsUIService;
    private searchQuery = '';

    private readonly openDialogEl: HTMLButtonElement;
    private readonly closeDialogEl: HTMLButtonElement;
    private readonly tableEl: HTMLTableElement;
    private readonly searchEl: HTMLInputElement;
    private readonly dialogEl: HTMLDialogElement;

    constructor() {
        super(template);
        this.offersFacade = Container.get(OffersFacade);
        this.streamElementsUIService = Container.get(StreamElementsUIService);

        this.render();

        this.openDialogEl = document.querySelector<HTMLButtonElement>('[data-hgf-manage-button]')!;
        this.closeDialogEl = document.querySelector<HTMLButtonElement>('[data-hgf-hidden-offers-close-popup]')!;
        this.tableEl = document.querySelector<HTMLTableElement>('[data-hgf-hidden-offers-table]')!;
        this.searchEl = document.querySelector<HTMLInputElement>('[data-hgf-search-offer]')!;
        this.dialogEl = document.querySelector<HTMLDialogElement>('[data-hgf-hidden-offers-popup]')!;

        this.onSearch = debounce(this.onSearch.bind(this), 500);
        this.onOpenDialog = this.onOpenDialog.bind(this);
        this.handleUnhideOffer = this.handleUnhideOffer.bind(this);
        this.onDialogClose = this.onDialogClose.bind(this);

        this.listenEvents();
    }

    render() {
        this.streamElementsUIService.userStatsEl.insertAdjacentElement('beforebegin', this.el);
    }

    destroy() {
        this.openDialogEl.removeEventListener('click', this.onOpenDialog);
        this.closeDialogEl.removeEventListener('click', this.onDialogClose);
        this.tableEl.removeEventListener('click', this.handleUnhideOffer);
        this.searchEl.removeEventListener('input', this.onSearch);

        super.destroy();
    }

    private listenEvents() {
        this.searchEl.addEventListener('input', this.onSearch);
        this.tableEl.addEventListener('click', this.handleUnhideOffer);
        this.openDialogEl.addEventListener('click', this.onOpenDialog);
        this.closeDialogEl.addEventListener('click', this.onDialogClose);
    }

    private onSearch() {
        this.searchQuery = this.searchEl.value.toLowerCase();
        this.renderHiddenOffers();
    }

    private onOpenDialog() {
        this.renderHiddenOffers();
        this.dialogEl.showModal();
    }

    private onDialogClose() {
        const dialogEl = document.querySelector<HTMLDialogElement>('[data-hgf-hidden-offers-popup]')!;
        const searchEl = document.querySelector<HTMLInputElement>('[data-hgf-search-offer]')!;

        this.searchQuery = '';
        searchEl.value = '';
        dialogEl.close();
    }

    private renderHiddenOffers() {
        const tBodyEl = this.tableEl.querySelector<HTMLTableSectionElement>('[data-hgf-hidden-offers-table-body]')!;
        const emptyStateEl = document.querySelector<HTMLDivElement>('[data-hgf-empty-offers]')!;

        tBodyEl.innerHTML = '';

        const filteredOffers = this.offersFacade.hiddenOffers.toReversed()
            .filter((offer) => offer.includes(this.searchQuery));

        const rowEls = filteredOffers.map((offer) => {
            const rowEl = document.createElement('tr');

            rowEl.classList.add('hgf-hidden-offers-manager__row');
            rowEl.dataset.hgfOfferName = offer;

            rowEl.innerHTML = `
                <td class="hgf-hidden-offers-manager__cell hgf-w-full">${offer}</td>
                <td class="hgf-hidden-offers-manager__cell">
                    <button class="hgf-hidden-offers-manager__remove-button" data-hgf-unhide-offer>Unhide</button>
                </td>
            `;

            return rowEl;
        });

        tBodyEl.append(...rowEls);

        this.tableEl.classList.toggle('hgf-hidden-offers-manager--hidden', filteredOffers.length === 0);
        emptyStateEl.classList.toggle('hgf-hidden-offers-manager--hidden', filteredOffers.length > 0);

        emptyStateEl.textContent = this.searchQuery ? 'No offers found' : 'No hidden offers';
    }

    private async handleUnhideOffer(event: Event) {
        const target = event.target as HTMLElement;

        if (!target.hasAttribute('data-hgf-unhide-offer')) {
            return;
        }

        const rowEl = target.closest<HTMLTableRowElement>('[data-hgf-offer-name]')!;
        const offerName = rowEl.dataset.hgfOfferName!;

        if (!window.confirm(`Are you sure you want to unhide the "${offerName}" offer?`)) {
            return;
        }

        try {
            await this.offersFacade.unhideOffer(offerName);
            rowEl.remove();
        } catch (error) {
            alert('Failed to hide offer');
            console.error(error);
        }
    }
}
