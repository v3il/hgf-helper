import { Container } from 'typedi';
import { GlobalSettingsService } from '@components/settings';
import './styles.css';
import { Offer } from '@store/modules/offers/models';
import { OffersFacade } from '@store/modules';
import template from './template.html?raw';

interface IParams {
    offer: Offer;
    offerEl: HTMLElement;
}

export class OfferView {
    private readonly offer;
    private readonly offerEl;
    private readonly offersFacade;
    private readonly settingsService;

    constructor({ offer, offerEl }: IParams) {
        this.offer = offer;
        this.offerEl = offerEl;

        this.offersFacade = Container.get(OffersFacade);
        this.settingsService = Container.get(GlobalSettingsService);

        this.clickHandler = this.clickHandler.bind(this);

        this.renderContainer();
        this.toggleVisibility();
        this.attachHideOfferClick();
    }

    private get isHidden() {
        const { offersMaxPrice } = this.settingsService.settings;

        return this.offer.isSoldOut // move to setting
            || this.offer.price > offersMaxPrice
            || this.offersFacade.isOfferHidden(this.offer);
    }

    renderContainer() {
        this.offerEl.insertAdjacentHTML('beforeend', template);

        const steamAppLinkEl = this.offerEl.querySelector<HTMLAnchorElement>('[data-steam-app-link]')!;

        steamAppLinkEl.href = this.offer.steamAppLink;

        if (this.offer.isDeficiency) {
            this.offerEl.querySelector('[data-container]')!.classList.add('hgfs-container--danger');
        }
    }

    private attachHideOfferClick() {
        const hideButtonEl = this.offerEl.querySelector('[data-hide]')!;

        hideButtonEl.addEventListener('click', this.clickHandler);
    }

    private async clickHandler() {
        if (!window.confirm(`Are you sure you want to hide the "${this.offer.name}" offer?`)) {
            return;
        }

        try {
            await this.offersFacade.hideOffer(this.offer);
            this.hideOffer();
        } catch (error) {
            alert('Failed to hide offer. Check your JSONBin configuration in the settings popup.');
            console.error(error);
        }
    }

    toggleVisibility() {
        this.isHidden ? this.hideOffer() : this.showOffer();
    }

    private hideOffer() {
        this.offerEl.classList.add('hgfs-offer--hidden');
    }

    private showOffer() {
        this.offerEl.classList.remove('hgfs-offer--hidden');
    }
}
