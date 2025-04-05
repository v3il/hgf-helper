import { StreamElementsUIService } from '@store/modules';
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import { AuthView } from '@store/views/authView';
import UIkit from 'uikit/dist/js/uikit';
import { BasicView } from '@components/BasicView';
import { OffersList } from './offer';
import { HiddenOffersManager } from './hiddenOffersManager';

export class ExtensionContainer extends BasicView {
    private readonly streamElementsUIService: StreamElementsUIService;
    private readonly authFacade: AuthFacade;

    private authView!: AuthView;
    private offersList!: OffersList;
    private hiddenOffersManager!: HiddenOffersManager;

    constructor() {
        super('<div></div>');
        this.authFacade = Container.get(AuthFacade);
        this.streamElementsUIService = Container.get(StreamElementsUIService);

        this.render();
        this.listenEvents();
    }

    render() {
        if (this.authFacade.isAuthenticated) {
            this.renderOfferViews();
        } else {
            this.renderAuthView();
        }
    }

    private listenEvents() {
        this.authFacade.onAuthenticated(() => {
            UIkit.notification({
                message: 'User authenticated',
                status: 'success',
                pos: 'bottom-right',
                timeout: 5000
            });

            this.authView.destroy();
            this.renderOfferViews();
        });

        this.authFacade.onLogout(() => {
            UIkit.notification({
                message: 'User logged out',
                status: 'success',
                pos: 'bottom-right',
                timeout: 5000
            });

            this.renderAuthView();

            this.offersList.destroy();
            this.hiddenOffersManager.destroy();
        });
    }

    private renderAuthView() {
        const streamElementsUIService = Container.get(StreamElementsUIService);

        streamElementsUIService.onLayoutRendered(() => {
            this.authView = new AuthView();

            this.authView.mount();
        });
    }

    private renderOfferViews() {
        const streamElementsUIService = Container.get(StreamElementsUIService);

        this.streamElementsUIService.enhanceStorePage();

        this.streamElementsUIService.whenOffersLoaded(async () => {
            // console.clear();
            await streamElementsUIService.sortOffers();

            this.offersList = new OffersList(this.streamElementsUIService.offersListEl);
            this.hiddenOffersManager = new HiddenOffersManager();
        });
    }
}
