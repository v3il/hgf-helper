import 'reflect-metadata';
import UIkit from 'uikit/dist/js/uikit.js';
import { Container } from 'typedi';
import { StreamElementsUIService } from '@store/modules';
import { UserFacade } from '@shared/settings';
import { AuthView, ExtensionContainer } from './views';
import './store.css';
import '@shared/styles/index.css';

const renderExtensionContainer = async () => {
    const streamElementsUIService = Container.get(StreamElementsUIService);

    streamElementsUIService.enhanceStorePage();

    streamElementsUIService.whenOffersLoaded(async () => {
        console.clear();
        await streamElementsUIService.sortOffers();
        new ExtensionContainer();
    });
};

const renderAuthView = () => {
    const streamElementsUIService = Container.get(StreamElementsUIService);

    streamElementsUIService.onLayoutRendered(() => {
        const authView = new AuthView();

        authView.mount();

        authView.events.on('authenticated', async () => {
            UIkit.notification({
                message: 'User authenticated',
                status: 'success',
                pos: 'bottom-right',
                timeout: 5000
            });

            authView.destroy();
            renderExtensionContainer();
        });
    });
};

export const start = async () => {
    const userFacade = Container.get(UserFacade);

    await userFacade.auth();

    console.clear();

    if (userFacade.isAuthenticated) {
        renderExtensionContainer();
    } else {
        renderAuthView();
    }
};
