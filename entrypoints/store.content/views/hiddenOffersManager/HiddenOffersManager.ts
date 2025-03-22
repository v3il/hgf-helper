import { OffersFacade, StreamElementsUIService } from '@store/modules';
import { Container } from 'typedi';
import template from './template.html?raw';
import './style.css';

export class HiddenOffersManager {
    private readonly offersFacade;
    private readonly streamElementsUIService;

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

        tBodyEl.addEventListener('click', async (event) => {
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
        });

        openDialogEl.addEventListener('click', () => {
            this.renderHiddenOffers();
            dialogEl.showModal();
        });

        closeDialogEl.addEventListener('click', () => {
            dialogEl.close();
        });
    }

    private renderHiddenOffers() {
        const tBodyEl = document.querySelector<HTMLTableSectionElement>('[data-hgf-hidden-offers-table-body]')!;

        tBodyEl.innerHTML = '';

        const rowEls = this.offersFacade.hiddenOffers.map((offer) => {
            const rowEl = document.createElement('tr');

            rowEl.classList.add('hgf-hidden-offers-manager__row');
            rowEl.dataset.hgfOfferName = offer;

            rowEl.innerHTML = `
                <td class="hgf-hidden-offers-manager__cell">${offer}</td>
                <td class="hgf-hidden-offers-manager__cell">
                    <button class="hgf-hidden-offers-manager__remove-button" data-hgf-unhide-offer>Remove</button>
                </td>
            `;

            return rowEl;
        });

        tBodyEl.append(...rowEls);
    }
}
