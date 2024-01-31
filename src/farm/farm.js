import 'reflect-metadata';

import { Container } from 'typedi';
import {
    HitsquadRunner,
    QuizService,
    SettingsService,
    LocalSettingsService,
    StreamStatusService,
    TwitchChatObserver,
    TwitchChatService,
    TwitchPlayerService,
    ChannelPointsClaimerService,
    TwitchElementsRegistry
} from './services';
import { ExtensionContainer } from './views';
import { InjectionTokens, isDev } from './consts';
import { TwitchUser } from './models';

import { DebugModeView } from './views/debugModeView/DebugModeView';
import { SettingsFacade } from './modules/settings';
import { MiniGamesFacade } from './modules/miniGames';
import { TwitchFacade } from './modules/twitch';
import { StreamFacade } from './modules/stream';

// function getUserName(userDropdownToggleEl) {
//     userDropdownToggleEl.click();
//
//     const userNameEl = document.querySelector('[data-a-target="user-display-name"]');
//     userDropdownToggleEl.click();
//
//     return userNameEl?.textContent.toLowerCase();
// }

TwitchFacade.instance.init(async () => {
    console.clear();
    console.info(`HGF helper is running in ${isDev ? 'dev' : 'prod'} mode`);

    await SettingsFacade.instance.loadSettings();
    StreamFacade.instance.checkStreamStatus();

    ExtensionContainer.create().mount(document.body);

    // console.error(1, TwitchFacade.instance.twitchUser);
    // const streamStatusCanvas = StreamStatusCanvas.create(document.body);
    // const debugModeView = DebugModeService.create(document.body);
    //
    // console.error(TwitchFacade.instance);

    //
    // console.error(6, SettingsFacade.instance.getLocalSetting('hitsquadRunner'));

    // await settingsService.loadSettings();
    // localSettingsService.loadSettings();

    // console.error(333, ChatFacade.instance);

    // const gf = ChatFacade.create();

    // const { chatScrollableAreaEl } = twitchElementsRegistry;
    //
    // Container.set([
    //     { id: InjectionTokens.ELEMENTS_REGISTRY, value: twitchElementsRegistry },
    //     { id: InjectionTokens.STREAM_STATUS_CANVAS, value: streamStatusCanvas },
    //     { id: InjectionTokens.DEBUG_MODE_VIEW, value: debugModeView },
    //     // { id: InjectionTokens.SETTINGS_SERVICE, value: settingsService },
    //     // { id: InjectionTokens.LOCAL_SETTINGS_SERVICE, value: localSettingsService },
    //     { id: InjectionTokens.TWITCH_USER, factory: () => TwitchUser.create(userName) },
    //     { id: InjectionTokens.CHAT_OBSERVER, factory: () => TwitchChatObserver.create(chatScrollableAreaEl) },
    //     { id: InjectionTokens.PLAYER_SERVICE, factory: () => TwitchPlayerService.create() },
    //     { id: InjectionTokens.CHAT_SERVICE, factory: () => TwitchChatService.create() },
    //     { id: InjectionTokens.STREAM_STATUS_SERVICE, factory: () => StreamStatusService.create() },
    //     { id: InjectionTokens.HITSQUAD_RUNNER, factory: () => HitsquadRunner.create() },
    //     { id: InjectionTokens.QUIZ_RUNNER, factory: () => QuizService.create() }
    //
    //     // { id: InjectionTokens.SETTINGS_FACADE, value: settingsFacade }
    // ]);
    //
    // ChannelPointsClaimerService.create(twitchElementsRegistry.chatButtonsContainerEl);
    //
    // ExtensionContainer.create().mount(document.body);
});

/* const twitchElementsRegistry = new TwitchElementsRegistry();

twitchElementsRegistry.onElementsReady(async () => {
    return;

    // eslint-disable-next-line no-unreachable
    console.clear();
    console.info(`HGF helper is running in ${isDev ? 'dev' : 'prod'} mode`);

    const userName = getUserName(twitchElementsRegistry.userDropdownToggleEl);
    const streamStatusCanvas = StreamStatusCanvas.create(document.body);
    const debugModeView = DebugModeService.create(document.body);

    console.error(TwitchFacade.instance);

    // const settingsService = SettingsService.create();
    // const localSettingsService = LocalSettingsService.create();

    // const settingsContainer = Container.of('settings');
    //
    // settingsContainer.set([
    //     { id: SettingsService, type: SettingsService },
    //     { id: LocalSettingsService, type: LocalSettingsService }
    // ]);

    // const settingsFacade = TwitchFacade.instance;

    await SettingsFacade.instance.loadSettings();

    // console.error(6, SettingsFacade.instance.getLocalSetting('hitsquadRunner'));

    // await settingsService.loadSettings();
    // localSettingsService.loadSettings();

    // console.error(333, ChatFacade.instance);

    // const gf = ChatFacade.create();

    const { chatScrollableAreaEl } = twitchElementsRegistry;

    Container.set([
        { id: InjectionTokens.ELEMENTS_REGISTRY, value: twitchElementsRegistry },
        { id: InjectionTokens.STREAM_STATUS_CANVAS, value: streamStatusCanvas },
        { id: InjectionTokens.DEBUG_MODE_VIEW, value: debugModeView },
        // { id: InjectionTokens.SETTINGS_SERVICE, value: settingsService },
        // { id: InjectionTokens.LOCAL_SETTINGS_SERVICE, value: localSettingsService },
        { id: InjectionTokens.TWITCH_USER, factory: () => TwitchUser.create(userName) },
        { id: InjectionTokens.CHAT_OBSERVER, factory: () => TwitchChatObserver.create(chatScrollableAreaEl) },
        { id: InjectionTokens.PLAYER_SERVICE, factory: () => TwitchPlayerService.create() },
        { id: InjectionTokens.CHAT_SERVICE, factory: () => TwitchChatService.create() },
        { id: InjectionTokens.STREAM_STATUS_SERVICE, factory: () => StreamStatusService.create() },
        { id: InjectionTokens.HITSQUAD_RUNNER, factory: () => HitsquadRunner.create() },
        { id: InjectionTokens.QUIZ_RUNNER, factory: () => QuizService.create() }

        // { id: InjectionTokens.SETTINGS_FACADE, value: settingsFacade }
    ]);

    ChannelPointsClaimerService.create(twitchElementsRegistry.chatButtonsContainerEl);

    ExtensionContainer.create().mount(document.body);
}); */
