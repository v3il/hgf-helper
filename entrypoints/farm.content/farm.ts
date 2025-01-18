import { SettingsFacade } from '@components/shared';
import { isDev } from './consts';
import { TwitchFacade } from './modules/twitch';
import { ExtensionContainer } from './views';

export const main = () => {
    TwitchFacade.instance.init(async () => {
        console.clear();
        console.info(`HGF helper is running in ${isDev ? 'dev' : 'prod'} mode`);

        await SettingsFacade.instance.loadSettings();

        ExtensionContainer.create().mount(document.body);
    });
};
