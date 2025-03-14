import 'reflect-metadata';
import { isDev } from '@components/consts';
import { ExtensionContainer } from '@twitch/views';
import { Container } from 'typedi';
import { TwitchElementsRegistry } from '@twitch/modules';
import { GlobalSettingsService, LocalSettingsService } from '@components/settings';
import { log } from '@components/utils';

export const main = () => {
    const twitchElementsRegistry = Container.get(TwitchElementsRegistry);
    const globalSettings = Container.get(GlobalSettingsService);
    const localSettings = Container.get(LocalSettingsService);

    twitchElementsRegistry.onElementsReady(async () => {
        console.clear();
        log(`Running in ${isDev ? 'dev' : 'prod'} mode`);

        await globalSettings.loadSettings();
        await localSettings.loadSettings();

        new ExtensionContainer().mount(document.body);
    });
};
