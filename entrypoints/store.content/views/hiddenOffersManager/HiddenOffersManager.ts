import { OffersFacade, StreamElementsUIService } from '@store/modules';
import { Container } from 'typedi';
import template from './template.html?raw';
import './style.css';

export class HiddenOffersManager {
    private readonly streamElementsUIService;
    private readonly offersFacade;

    constructor() {
        this.streamElementsUIService = Container.get(StreamElementsUIService);
        this.offersFacade = Container.get(OffersFacade);

        this.renderContainer();
        this.listenEvents();
    }

    private renderContainer() {
        this.streamElementsUIService.userStatsEl.insertAdjacentHTML('beforebegin', template);
    }

    private listenEvents() {
        const openDialogEl = document.querySelector<HTMLButtonElement>('[data-manage-button]')!;

        const dialogEl = document.querySelector<HTMLDialogElement>('[data-manage-hidden-offers-popup]')!;
        const closeDialogEl = document.querySelector<HTMLButtonElement>('[data-manage-hidden-offers-close-popup]')!;

        closeDialogEl.addEventListener('click', () => {
            dialogEl.close();
        });

        openDialogEl.addEventListener('click', () => {
            this.renderHiddenOffers();
            dialogEl.showModal();
        });
    }

    private renderHiddenOffers() {
        const tBodyEl = document.querySelector<HTMLTableSectionElement>('[data-manage-hidden-offers-table-body]')!;

        const rowEls = this.offersFacade.hiddenOffers.map((offer) => {
            const rowEl = document.createElement('tr');

            rowEl.classList.add('hgf-hidden-offers-manager__row');

            rowEl.innerHTML = `
                <td class="hgf-hidden-offers-manager__cell">${offer}</td>
                <td class="hgf-hidden-offers-manager__cell">
                    <button class="hgf-hidden-offers-manager__remove-button">Remove</button>
                </td>
            `;

            return rowEl;
        });

        tBodyEl.append(...rowEls);
    }
}
