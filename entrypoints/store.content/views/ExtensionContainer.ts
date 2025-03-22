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
    }

    private renderOfferControls() {
        new OfferControls(this.streamElementsUIService.offersListEl);
    }

    private renderHiddenOffersManager() {
        new HiddenOffersManager();
    }
}
