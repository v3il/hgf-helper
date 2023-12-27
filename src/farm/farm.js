import { Container } from 'typedi';
import {
    HitsquadRunner,
    QuizService,
    SettingsService,
    StreamStatusService,
    TwitchChatObserver,
    TwitchChatService,
    TwitchPlayerService,
    ChannelPointsClaimerService
} from './services';
import { CanvasContainer, ExtensionContainer } from './views';
import { InjectionTokens, isDev } from './consts';
import { TwitchUser } from './models';
import 'reflect-metadata';

function getTwitchElements() {
    const userDropdownToggleEl = document.querySelector('[data-a-target="user-menu-toggle"]');
    const chatInputEl = document.querySelector('[data-a-target="chat-input"]');
    const sendMessageEl = document.querySelector('[data-a-target="chat-send-button"]');
    const chatContainerEl = document.querySelector('.chat-shell');
    const videoEl = document.querySelector('video');

    return {
        userDropdownToggleEl,
        chatInputEl,
        sendMessageEl,
        chatContainerEl,
        videoEl
    };
}

function getUserName(userDropdownToggleEl) {
    userDropdownToggleEl.click();

    const userNameEl = document.querySelector('[data-a-target="user-display-name"]');
    userDropdownToggleEl.click();

    return userNameEl?.textContent.toLowerCase();
}

async function runApp({ chatContainerEl, userDropdownToggleEl }) {
    console.clear();
    console.info(`HGF helper is running in ${isDev ? 'dev' : 'prod'} mode`);

    const userName = getUserName(userDropdownToggleEl);
    const canvasView = CanvasContainer.create(document.body);
    const settingsService = SettingsService.create();

    await settingsService.loadSettings();

    const chatScrollableAreaEl = chatContainerEl.querySelector('.chat-scrollable-area__message-container');

    Container.set([
        { id: InjectionTokens.TWITCH_USER, factory: () => TwitchUser.create(userName) },
        { id: InjectionTokens.SETTINGS_SERVICE, factory: () => settingsService },
        { id: InjectionTokens.CHAT_OBSERVER, factory: () => TwitchChatObserver.create(chatScrollableAreaEl) },
        { id: InjectionTokens.PLAYER_SERVICE, factory: () => TwitchPlayerService.create() },
        { id: InjectionTokens.CHAT_SERVICE, factory: () => TwitchChatService.create() },
        { id: InjectionTokens.STREAM_STATUS_SERVICE, factory: () => StreamStatusService.create({ canvasView }) },
        { id: InjectionTokens.HITSQUAD_RUNNER, factory: () => HitsquadRunner.create() },
        { id: InjectionTokens.QUIZ_RUNNER, factory: () => QuizService.create() },
        { id: InjectionTokens.CANVAS_VIEW, factory: () => canvasView }
    ]);

    ChannelPointsClaimerService.create(chatContainerEl.querySelector('.chat-input__buttons-container'));

    ExtensionContainer.create().mount(document.body);
}

function isElementsExist(elements) {
    return Object.values(elements).every((element) => element !== null);
}

const intervalId = setInterval(() => {
    const twitchElements = getTwitchElements();

    if (isElementsExist(twitchElements)) {
        clearInterval(intervalId);
        setTimeout(() => runApp(twitchElements), 4000);
    }
}, 500);
