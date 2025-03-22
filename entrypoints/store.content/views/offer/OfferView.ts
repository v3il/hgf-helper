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

        this.renderContainer();
        this.toggleVisibility();
        this.listenEvents();
    }

    private get isHidden() {
        const { offersMaxPrice, hideSoldOutOffers } = this.settingsService.settings;

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
            alert('Failed to hide offer. Check your JSONBin configuration in the settings popup.');
            console.error(error);
        }
    }

    private highlightLowVolumeOffer() {
        const { highlightLowVolumeOffers } = this.settingsService.settings;

        this.offerEl.querySelector('[data-container]')!.classList
            .toggle('hgfs-container--danger', this.offer.isLowVolume && highlightLowVolumeOffers);
    }

    private listenEvents() {
        const hideButtonEl = this.offerEl.querySelector('[data-hide]')!;

        hideButtonEl.addEventListener('click', () => this.clickHandler());

        this.settingsService.events.on('setting-changed:highlightLowVolumeOffers', () => {
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
