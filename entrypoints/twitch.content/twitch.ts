import 'reflect-metadata';
import { TwitchFacade } from '@twitch/modules/twitch';
import { isDev } from '@twitch/consts';
import { log, SettingsFacade } from '@components/shared';
import { ExtensionContainer } from '@twitch/views';

export const main = () => {
    TwitchFacade.instance.init(async () => {
        console.clear();
        log(`Running in ${isDev ? 'dev' : 'prod'} mode`);

        await SettingsFacade.instance.loadSettings();

        new ExtensionContainer().mount(document.body);
    });
};
