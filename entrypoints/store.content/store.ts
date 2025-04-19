import 'reflect-metadata';
import { mount } from 'svelte';
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import './store.css';
import '@shared/styles/index.css';
import { StoreExtension } from './views';

export const start = async () => {
    const authFacade = Container.get(AuthFacade);

    authFacade.auth()
        .catch((error) => console.error('Error during authentication:', error))
        .finally(() => {
            mount(StoreExtension, {
                target: document.body
            });
        });
};
