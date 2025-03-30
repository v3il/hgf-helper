import 'reflect-metadata';
import { GlobalSettingsService } from '@components/settings';
import { Container } from 'typedi';
import { StreamElementsUIService, OffersFacade } from '@store/modules';
import { UserFacade } from '@shared/settings';
import { log, showToast } from '@utils';
import { AuthView, ExtensionContainer } from './views';
import 'bootstrap/dist/css/bootstrap.css';
import './store.css';

const renderExtensionContainer = async () => {
    const userFacade = Container.get(UserFacade);
    const globalSettings = Container.get(GlobalSettingsService);
    const streamElementsUIService = Container.get(StreamElementsUIService);
    const offersFacade = Container.get(OffersFacade);

    await globalSettings.loadSettings();
    streamElementsUIService.enhanceStorePage();

    streamElementsUIService.whenOffersLoaded(async () => {
        // console.clear();

        await streamElementsUIService.sortOffers();

        await offersFacade.fetchHiddenOffers()
            .catch((error) => {
                console.error(error);
                // alert('Failed to fetch hidden offers. Please check your JSONBin credentials in the settings popup.');
            });

        new ExtensionContainer();
    });
};

const renderAuthView = () => {
    const streamElementsUIService = Container.get(StreamElementsUIService);

    streamElementsUIService.onLayoutRendered(() => {
        const authView = new AuthView();

        authView.mount();

        authView.events.on('authenticated', async () => {
            showToast('User authenticated', { type: 'success' });
            log('User authenticated');
            authView.destroy();
            renderExtensionContainer();
        });
    });
};

export const start = async () => {
    console.clear();

    const userFacade = Container.get(UserFacade);

    await userFacade.auth();

    if (!userFacade.isAuthenticated) {
        log('User not authenticated');
        return renderAuthView();
    }

    renderExtensionContainer();
};
