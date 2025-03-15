import 'reflect-metadata';
import { isDev } from '@components/consts';
import { ExtensionContainer } from '@twitch/views';
import { Container } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { GlobalSettingsService, LocalSettingsService } from '@components/settings';
import { log } from '@components/utils';

export const main = () => {
    const twitchUIService = Container.get(TwitchUIService);
    const globalSettings = Container.get(GlobalSettingsService);
    const localSettings = Container.get(LocalSettingsService);

    twitchUIService.whenStreamReady(async () => {
        console.clear();
        log(`Running in ${isDev ? 'dev' : 'prod'} mode`);

        localSettings.loadSettings();
        await globalSettings.loadSettings();

        new ExtensionContainer().mount(document.body);
    });
};
