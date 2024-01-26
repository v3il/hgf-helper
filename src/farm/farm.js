import { Container } from 'typedi';
import {
    HitsquadRunner,
    QuizService,
    SettingsService,
    StreamStatusService,
    TwitchChatObserver,
    TwitchChatService,
    TwitchPlayerService,
    ChannelPointsClaimerService,
    TwitchElementsRegistry
} from './services';
import { StreamStatusCanvas, ExtensionContainer } from './views';
import { InjectionTokens, isDev } from './consts';
import { TwitchUser } from './models';
import 'reflect-metadata';
import { DebugModeView } from './views/debugModeView/DebugModeView';

function getUserName(userDropdownToggleEl) {
    userDropdownToggleEl.click();

    const userNameEl = document.querySelector('[data-a-target="user-display-name"]');
    userDropdownToggleEl.click();

    return userNameEl?.textContent.toLowerCase();
}

const twitchElementsRegistry = new TwitchElementsRegistry();

twitchElementsRegistry.onElementsReady(async () => {
    console.clear();
    console.info(`HGF helper is running in ${isDev ? 'dev' : 'prod'} mode`);

    const userName = getUserName(twitchElementsRegistry.userDropdownToggleEl);
    const streamStatusCanvas = StreamStatusCanvas.create(document.body);
    const debugModeView = DebugModeView.create(document.body);
    const settingsService = SettingsService.create();

    await settingsService.loadSettings();

    const { chatScrollableAreaEl } = twitchElementsRegistry;

    Container.set([
        { id: InjectionTokens.ELEMENTS_REGISTRY, value: twitchElementsRegistry },
        { id: InjectionTokens.STREAM_STATUS_CANVAS, value: streamStatusCanvas },
        { id: InjectionTokens.DEBUG_MODE_VIEW, value: debugModeView },
        { id: InjectionTokens.SETTINGS_SERVICE, value: settingsService },
        { id: InjectionTokens.TWITCH_USER, factory: () => TwitchUser.create(userName) },
        { id: InjectionTokens.CHAT_OBSERVER, factory: () => TwitchChatObserver.create(chatScrollableAreaEl) },
        { id: InjectionTokens.PLAYER_SERVICE, factory: () => TwitchPlayerService.create() },
        { id: InjectionTokens.CHAT_SERVICE, factory: () => TwitchChatService.create() },
        { id: InjectionTokens.STREAM_STATUS_SERVICE, factory: () => StreamStatusService.create() },
        { id: InjectionTokens.HITSQUAD_RUNNER, factory: () => HitsquadRunner.create() },
        { id: InjectionTokens.QUIZ_RUNNER, factory: () => QuizService.create() }
    ]);

    ChannelPointsClaimerService.create(twitchElementsRegistry.chatButtonsContainerEl);

    ExtensionContainer.create().mount(document.body);
});
