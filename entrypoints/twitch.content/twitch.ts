import 'reflect-metadata';
import { isDev } from '@twitch/consts';
import { log, SettingsFacade } from '@components/shared';
import { ExtensionContainer } from '@twitch/views';
import { Container } from 'typedi';
import { TwitchElementsRegistry } from '@twitch/modules';

export const main = () => {
    const twitchElementsRegistry = Container.get(TwitchElementsRegistry);

    twitchElementsRegistry.onElementsReady(async () => {
        console.clear();
        log(`Running in ${isDev ? 'dev' : 'prod'} mode`);

        await SettingsFacade.instance.loadSettings();

        new ExtensionContainer().mount(document.body);
    });
};
