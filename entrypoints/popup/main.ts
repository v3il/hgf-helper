import 'reflect-metadata';
import './style.css';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/range/range.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import { AuthFacade } from '@shared/modules';
import { Container } from 'typedi';
import { SettingsEditorView } from './settingsEditor';
import { AuthView } from './authView';

const authFacade = Container.get(AuthFacade);

setBasePath('../..'); // /public

document.addEventListener('DOMContentLoaded', async () => {
    const appEl = document.getElementById('app')!;

    let settingsEditorView: SettingsEditorView;
    let authView: AuthView;

    await authFacade.auth();

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
