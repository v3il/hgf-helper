import 'reflect-metadata';
import './style.css';
import { AuthFacade } from '@shared/modules';
import { Container } from 'typedi';
import { SettingsEditorView } from './settingsEditor';
import { AuthView } from './authView';
import '@shared/styles/index.css';
import 'uikit';

const authFacade = Container.get(AuthFacade);

document.addEventListener('DOMContentLoaded', async () => {
    const appEl = document.getElementById('app')!;

    let settingsEditorView: SettingsEditorView;
    let authView: AuthView;

    await authFacade.auth().catch((error) => console.error('Error during authentication:', error));

    console.error(authFacade.isAuthenticated);

    if (authFacade.isAuthenticated) {
        settingsEditorView = new SettingsEditorView(appEl);
    } else {
        authView = new AuthView(appEl);
    }

    authFacade.onAuthenticated(() => {
        authView.destroy();
        settingsEditorView = new SettingsEditorView(appEl);
    });

    authFacade.onLogout(() => {
        settingsEditorView.destroy();
        authView = new AuthView(appEl);
    });
});
