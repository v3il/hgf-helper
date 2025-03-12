import 'reflect-metadata';
import { TwitchFacade } from '@farm/modules/twitch';
import { isDev } from '@farm/consts';
import { SettingsFacade } from '@components/shared';
import { ExtensionContainer } from '@farm/views';

export const main = () => {
    TwitchFacade.instance.init(async () => {
        console.clear();
        console.info(`HGF helper is running in ${isDev ? 'dev' : 'prod'} mode`);

        await SettingsFacade.instance.loadSettings();

        new ExtensionContainer().mount(document.body);
    });
};
