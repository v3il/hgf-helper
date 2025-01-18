import { SettingsFacade } from '@components/shared';
import { isDev } from './consts';
import { TwitchFacade } from './modules/twitch';
import { ChatFacade } from './modules/chat';
import { StreamFacade } from './modules/stream';
import { MiniGamesFacade } from './modules/miniGames';
import { ExtensionContainer } from './views';

export const main = () => {
    TwitchFacade.instance.init(async () => {
        console.clear();
        console.info(`HGF helper is running in ${isDev ? 'dev' : 'prod'} mode`);

        await SettingsFacade.instance.loadSettings();

        ExtensionContainer.create({
            twitchFacade: TwitchFacade.instance,
            streamFacade: StreamFacade.instance,
            chatFacade: ChatFacade.instance,
            miniGamesFacade: MiniGamesFacade.instance
        }).mount(document.body);
    });
};
