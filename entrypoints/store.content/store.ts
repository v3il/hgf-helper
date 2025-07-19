import 'reflect-metadata';
import { mount } from 'svelte';
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import './store.css';
import { ExtensionRoot } from './views';
import { StreamElementsUIService } from '@store/modules';
import { logError } from '@utils';

export const main = async () => {
    const authFacade = Container.get(AuthFacade);
    const streamElementsUIService = Container.get(StreamElementsUIService);

    await authFacade.auth()
        .catch((error) => logError('Error during authentication', error));

    streamElementsUIService.onLayoutRendered(() => {
        const rootEl = document.createElement('div');

        streamElementsUIService.sidebarEl.appendChild(rootEl);

        mount(ExtensionRoot, {
            target: rootEl
        });
    });
};
