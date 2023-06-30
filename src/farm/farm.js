import { Container } from 'typedi';
import {
    HitsquadRunner,
    QuizService,
    SettingsService,
    StreamStatusService,
    TwitchChatObserver,
    TwitchChatService,
    TwitchPlayerService
} from './services';
import { CanvasContainer, ExtensionContainer } from './views';
import { InjectionTokens } from './consts';
import { users } from './users';
import { TwitchUser } from './models';
import 'reflect-metadata';

function getTwitchElements() {
    const userDropdownToggleEl = document.querySelector('[data-a-target="user-menu-toggle"]');
    const chatInputEl = document.querySelector('[data-a-target="chat-input"]');
    const sendMessageButtonEl = document.querySelector('[data-a-target="chat-send-button"]');
    const chatContainerEl = document.querySelector('.chat-scrollable-area__message-container');
    const videoEl = document.querySelector('video');

    return {
        userDropdownToggleEl,
        chatInputEl,
        sendMessageButtonEl,
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

async function runApp({
    chatInputEl, sendMessageButtonEl, chatContainerEl, userDropdownToggleEl
}) {
    console.clear();

    const userName = getUserName(userDropdownToggleEl);
    const userConfig = users.find(({ name }) => name === userName);

    if (!userConfig) {
        return;
    }

    const canvasContainerEl = CanvasContainer.create().mount(document.body);

    Container.set([
        { id: InjectionTokens.SETTINGS_SERVICE, factory: () => SettingsService.create(window.localStorage) },
        { id: InjectionTokens.TWITCH_USER, factory: () => TwitchUser.create(userConfig) },
        { id: InjectionTokens.CHAT_OBSERVER, factory: () => TwitchChatObserver.create(chatContainerEl) },
        { id: InjectionTokens.PLAYER_SERVICE, factory: () => TwitchPlayerService.create() },
        {
            id: InjectionTokens.CHAT_SERVICE,
            factory: () => TwitchChatService.create({ chatInputEl, sendMessageButtonEl })
        },
        { id: InjectionTokens.STREAM_STATUS_SERVICE, factory: () => StreamStatusService.create({ canvasContainerEl }) },
        { id: InjectionTokens.HITSQUAD_RUNNER, factory: () => HitsquadRunner.create() },
        { id: InjectionTokens.QUIZ_RUNNER, factory: () => QuizService.create() }
    ]);

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
