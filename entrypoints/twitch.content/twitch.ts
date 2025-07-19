import 'reflect-metadata';
import './twitch.css';
import { ExtensionRoot } from '@twitch/views';
import { Container } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { AuthFacade } from '@shared/modules';
import { isDev } from '@shared/consts';
import { log, logError } from '@utils';
import { mount, unmount } from 'svelte';
import { isHitsquadChannel } from './config';

export const main = async () => {
    let currentView: Record<string, any> | null;

    const twitchUIService = Container.get(TwitchUIService);
    const authFacade = Container.get(AuthFacade);

    await authFacade
        .auth()
        .catch((error) => logError('Error during authentication:', error));

    log(`Running in ${isDev ? 'dev' : 'prod'} mode`);

    if (isHitsquadChannel()) {
        twitchUIService.whenStreamReady(() => {
            currentView = mount(ExtensionRoot, {
                target: document.body
            });
        });
    }

    window.addEventListener('hgf-helper:urlChanged', () => {
        if (currentView) {
            unmount(currentView);
            currentView = null;
        }

        if (isHitsquadChannel()) {
            location.reload();
        }
    });
};
