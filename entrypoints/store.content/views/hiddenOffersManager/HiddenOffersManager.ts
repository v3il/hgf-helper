import { OffersFacade, StreamElementsUIService } from '@store/modules';
import { debounce } from '@components/utils';
import { Container } from 'typedi';
import template from './template.html?raw';
import './style.css';

export class HiddenOffersManager {
    private readonly offersFacade;
    private readonly streamElementsUIService;
    private searchQuery = '';

    constructor() {
        this.offersFacade = Container.get(OffersFacade);
        this.streamElementsUIService = Container.get(StreamElementsUIService);

        this.renderContainer();
        this.listenEvents();
    }

    private renderContainer() {
        this.streamElementsUIService.userStatsEl.insertAdjacentHTML('beforebegin', template);
    }

    private listenEvents() {
        const openDialogEl = document.querySelector<HTMLButtonElement>('[data-hgf-manage-button]')!;
        const dialogEl = document.querySelector<HTMLDialogElement>('[data-hgf-hidden-offers-popup]')!;
        const closeDialogEl = document.querySelector<HTMLButtonElement>('[data-hgf-hidden-offers-close-popup]')!;
        const tBodyEl = document.querySelector<HTMLTableSectionElement>('[data-hgf-hidden-offers-table-body]')!;
        const searchEl = document.querySelector<HTMLInputElement>('[data-hgf-search-offer]')!;

        searchEl.addEventListener('input', debounce(() => {
            this.searchQuery = searchEl.value.toLowerCase();
            this.renderHiddenOffers();
        }, 500));

        tBodyEl.addEventListener('click', (event) => this.handleUnhideOffer(event));

        openDialogEl.addEventListener('click', () => {
            this.renderHiddenOffers();
            dialogEl.showModal();
        });

        closeDialogEl.addEventListener('click', () => {
            this.searchQuery = '';
            searchEl.value = '';
            dialogEl.close();
        });
    }

    private renderHiddenOffers() {
        const tableEl = document.querySelector<HTMLTableSectionElement>('[data-hgf-hidden-offers-table]')!;
        const tBodyEl = document.querySelector<HTMLTableSectionElement>('[data-hgf-hidden-offers-table-body]')!;
        const emptyStateEl = document.querySelector<HTMLDivElement>('[data-hgf-empty-offers]')!;

        tBodyEl.innerHTML = '';

        const filteredOffers = this.offersFacade.hiddenOffers.toReversed()
            .filter((offer) => offer.includes(this.searchQuery));

        const rowEls = filteredOffers.map((offer) => {
            const rowEl = document.createElement('tr');

            rowEl.classList.add('hgf-hidden-offers-manager__row');
            rowEl.dataset.hgfOfferName = offer;

            rowEl.innerHTML = `
                <td class="hgf-hidden-offers-manager__cell hgf-hidden-offers-manager__cell--name">${offer}</td>
                <td class="hgf-hidden-offers-manager__cell">
                    <button class="hgf-hidden-offers-manager__remove-button" data-hgf-unhide-offer>Remove</button>
                </td>
            `;

            return rowEl;
        });

        tBodyEl.append(...rowEls);

        tableEl.classList.toggle('hgf-hidden-offers-manager--hidden', filteredOffers.length === 0);
        emptyStateEl.classList.toggle('hgf-hidden-offers-manager--hidden', filteredOffers.length > 0);

        emptyStateEl.textContent = this.searchQuery
            ? 'No offers found'
            : 'No hidden offers or JSONBin configuration is incorrect';
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
            alert('Failed to hide offer. Check your JSONBin configuration in the settings popup.');
            console.error(error);
        }
    }
}
