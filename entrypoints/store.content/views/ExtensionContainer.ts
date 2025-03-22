import { StreamElementsUIService } from '@store/modules';
import { Container } from 'typedi';
import { OfferControls } from './offer';
import { HiddenOffersManager } from './hiddenOffersManager';

export class ExtensionContainer {
    private readonly streamElementsUIService: StreamElementsUIService;

    constructor() {
        this.streamElementsUIService = Container.get(StreamElementsUIService);

        this.renderOfferControls();
        this.renderHiddenOffersManager();

        const button = document.querySelector('sl-button');
        console.log(button); // Перевірте, чи не null
    }

    private renderOfferControls() {
        new OfferControls(this.streamElementsUIService.offersListEl);
    }

    private renderHiddenOffersManager() {
        new HiddenOffersManager();
    }
}
