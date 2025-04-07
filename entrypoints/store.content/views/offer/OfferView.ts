import { Container } from 'typedi';
import './styles.css';
import { Offer } from '@store/modules/offers/models';
import { OffersFacade } from '@store/modules';
import { SettingsFacade } from '@shared/modules';
import { BasicView } from '@shared/views';
import template from './template.html?raw';

interface IParams {
    offer: Offer;
    offerEl: HTMLElement;
}

export class OfferView extends BasicView {
    private readonly offer;
    private readonly offerEl;
    private readonly offersFacade;
    private readonly settingsFacade;

    constructor({ offer, offerEl }: IParams) {
        super(template);
        this.offer = offer;
        this.offerEl = offerEl;

        this.offersFacade = Container.get(OffersFacade);
        this.settingsFacade = Container.get(SettingsFacade);

        this.hideOfferHandler = this.hideOfferHandler.bind(this);

        this.render();
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

    render() {
        this.offerEl.insertAdjacentElement('beforeend', this.el);

        const steamAppLinkEl = this.el.querySelector<HTMLAnchorElement>('[data-steam-app-link]')!;

        steamAppLinkEl.href = this.offer.steamAppLink;

        this.highlightLowVolumeOffer();
    }

    private async hideOfferHandler() {
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

        this.el.classList.toggle('hgfs-container--danger', this.offer.isLowVolume && highlightLowVolumeOffers);
    }

    private listenEvents() {
        const hideButtonEl = this.el.querySelector('[data-hide]')!;

        hideButtonEl.addEventListener('click', this.hideOfferHandler);

        const unsubscribe = this.settingsFacade.onSettingChanged('highlightLowVolumeOffers', () => {
            this.highlightLowVolumeOffer();
        });

        this.listeners.push(unsubscribe);
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

    destroy() {
        const hideButtonEl = this.el.querySelector('[data-hide]')!;

        hideButtonEl.removeEventListener('click', this.hideOfferHandler);

        this.showOffer();
        super.destroy();
    }
}
