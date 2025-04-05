import { Container } from 'typedi';
import './styles.css';
import { Offer } from '@store/modules/offers/models';
import { OffersFacade } from '@store/modules';
import { SettingsFacade } from '@shared/modules';
import template from './template.html?raw';

interface IParams {
    offer: Offer;
    offerEl: HTMLElement;
}

export class OfferView {
    private readonly offer;
    private readonly offerEl;
    private readonly offersFacade;
    private readonly settingsFacade;

    constructor({ offer, offerEl }: IParams) {
        this.offer = offer;
        this.offerEl = offerEl;

        this.offersFacade = Container.get(OffersFacade);
        this.settingsFacade = Container.get(SettingsFacade);

        this.renderContainer();
        this.toggleVisibility();
        this.listenEvents();
    }

    private get isHidden() {
        const { offersMaxPrice, hideSoldOutOffers } = this.settingsFacade.settings;

        if (hideSoldOutOffers && this.offer.isSoldOut) {
            return true;
        }

        return this.offer.price > offersMaxPrice || this.offersFacade.isOfferHidden(this.offer);
    }

    private renderContainer() {
        this.offerEl.insertAdjacentHTML('beforeend', template);

        const steamAppLinkEl = this.offerEl.querySelector<HTMLAnchorElement>('[data-steam-app-link]')!;

        steamAppLinkEl.href = this.offer.steamAppLink;

        this.highlightLowVolumeOffer();
    }

    private async clickHandler() {
        if (!window.confirm(`Are you sure you want to hide the "${this.offer.name}" offer?`)) {
            return;
        }

        try {
            await this.offersFacade.hideOffer(this.offer);
            this.hideOffer();
        } catch (error) {
            alert('Failed to hide offer');
            console.error(error);
        }
    }

    private highlightLowVolumeOffer() {
        const { highlightLowVolumeOffers } = this.settingsFacade.settings;

        this.offerEl.querySelector('[data-container]')!.classList
            .toggle('hgfs-container--danger', this.offer.isLowVolume && highlightLowVolumeOffers);
    }

    private listenEvents() {
        const hideButtonEl = this.offerEl.querySelector('[data-hide]')!;

        hideButtonEl.addEventListener('click', () => this.clickHandler());

        this.settingsFacade.onSettingChanged('highlightLowVolumeOffers', () => {
            this.highlightLowVolumeOffer();
        });
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
