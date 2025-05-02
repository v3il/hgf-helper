import 'reflect-metadata';
import './twitch.css';
import { ExtensionRoot } from '@twitch/views';
import { Container } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { AuthFacade } from '@shared/modules';
import { isDev } from '@shared/consts';
import { log } from '@utils';
import { mount } from 'svelte';

export const main = async () => {
    const twitchUIService = Container.get(TwitchUIService);
    const authFacade = Container.get(AuthFacade);

    await authFacade
        .auth()
        .catch((error) => console.error('Error during authentication:', error));

    console.clear();
    log(`Running in ${isDev ? 'dev' : 'prod'} mode`);

    twitchUIService.whenStreamReady(async () => {
        const extensionTargetEl = document.createElement('div');

        twitchUIService.streamInfoEl!.insertAdjacentElement('afterbegin', extensionTargetEl);

        mount(ExtensionRoot, {
            target: extensionTargetEl
        });
    });
};
