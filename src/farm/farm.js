import { isDev } from './consts';
import { TwitchFacade } from './modules/twitch';
import { ChatFacade } from './modules/chat';
import { StreamFacade } from './modules/stream';
import { MiniGamesFacade } from './modules/miniGames';
import { ExtensionContainer } from './views';
import { SettingsFacade } from '../shared/settings';

TwitchFacade.instance.init(async () => {
    console.clear();
    console.info(`HGF helper is running in ${isDev ? 'dev' : 'prod'} mode`);

    await SettingsFacade.instance.loadSettings();

    ExtensionContainer.create({
        settingsFacade: SettingsFacade.instance,
        streamFacade: StreamFacade.instance,
        chatFacade: ChatFacade.instance,
        miniGamesFacade: MiniGamesFacade.instance
    }).mount(document.body);
});
