import 'reflect-metadata';
import './style.css';
import { AuthFacade } from '@shared/modules';
import { Container } from 'typedi';
import '@shared/styles/index.css';
import 'uikit';
import PopupView from './views/PopupView.svelte';
import { mount } from 'svelte';

const authFacade = Container.get(AuthFacade);

await authFacade.auth()
    .catch((error) => console.error('Error during authentication:', error))
    .finally(() => {
        mount(PopupView, {
            target: document.getElementById('app')!,
        })
    });
