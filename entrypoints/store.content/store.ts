import 'reflect-metadata';
import { GlobalSettingsService } from '@components/settings';
import { Container } from 'typedi';
import { StreamElementsUIService, OffersFacade } from '@store/modules';
import { AuthFacade } from '@shared/settings';
import { AuthView, ExtensionContainer } from './views';
import 'halfmoon/css/halfmoon.min.css';
import './store.css';

const renderExtensionContainer = async () => {
    const globalSettings = Container.get(GlobalSettingsService);
    const streamElementsUIService = Container.get(StreamElementsUIService);
    const offersFacade = Container.get(OffersFacade);

    await globalSettings.loadSettings();
    streamElementsUIService.enhanceStorePage();

    streamElementsUIService.whenOffersLoaded(async () => {
        console.clear();

        await streamElementsUIService.sortOffers();

        await offersFacade.fetchHiddenOffers()
            .catch((error) => {
                console.error(error);
                alert('Failed to fetch hidden offers. Please check your JSONBin credentials in the settings popup.');
            });

        new ExtensionContainer();
    });
};

const renderAuthView = () => {
    const streamElementsUIService = Container.get(StreamElementsUIService);

    streamElementsUIService.onLayoutRendered(() => {
        const authView = new AuthView();

        authView.mount();

        authView.events.on('authorized', () => {
            authView.destroy();
            renderExtensionContainer();
        });
    });
};

export const start = async () => {
    const authFacade = Container.get(AuthFacade);

    await authFacade.auth();

    if (!authFacade.isAuthenticated) {
        return renderAuthView();
    }

    renderExtensionContainer();
};
