// @ts-ignore
import { isDev } from './consts';
// @ts-ignore
import { TwitchFacade } from './modules/twitch';
// @ts-ignore
import { ChatFacade } from './modules/chat';
// @ts-ignore
import { StreamFacade } from './modules/stream';
// @ts-ignore
import { MiniGamesFacade } from './modules/miniGames';
// @ts-ignore
import { ExtensionContainer } from './views';
import { SettingsFacade } from '@/components/shared';

export const start = () => {
    TwitchFacade.instance.init(async () => {
        console.clear();
        console.info(`HGF helper is running in ${isDev ? 'dev' : 'prod'} mode`);

        await SettingsFacade.instance.loadSettings();

        ExtensionContainer.create({
            twitchFacade: TwitchFacade.instance,
            settingsFacade: SettingsFacade.instance,
            streamFacade: StreamFacade.instance,
            chatFacade: ChatFacade.instance,
            miniGamesFacade: MiniGamesFacade.instance
        }).mount(document.body);
    });
};
