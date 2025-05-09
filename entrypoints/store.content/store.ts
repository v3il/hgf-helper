import 'reflect-metadata';
import { mount } from 'svelte';
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import './store.css';
import { ExtensionRoot } from './views';
import { StreamElementsUIService } from '@store/modules';

export const start = async () => {
    const authFacade = Container.get(AuthFacade);
    const streamElementsUIService = Container.get(StreamElementsUIService);

    await authFacade.auth()
        .catch((error) => console.error('Error during authentication:', error));

    streamElementsUIService.onLayoutRendered(() => {
        const rootEl = document.createElement('div');

        streamElementsUIService.sidebarEl.appendChild(rootEl);

        mount(ExtensionRoot, {
            target: rootEl
        });
    });
};
