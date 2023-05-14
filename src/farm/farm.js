import {
    StreamStatusService,
    TwitchChatService,
    QuizService,
    TwitchChatObserver,
    GameRunner, WaiterService
} from './services';
import { CanvasContainer, ExtensionContainer } from './views';
import { TwitchUser } from './models';
import { Commands, MessageTemplates, Timing } from './consts';
import { users } from './users';

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
    const userName = getUserName(userDropdownToggleEl);

    if (!userName) {
        return;
    }

    const userConfig = users.find(({ name }) => name === userName);
    const twitchUser = TwitchUser.create(userConfig);

    WaiterService.create({ twitchUser });

    const twitchChatObserver = TwitchChatObserver.create(chatContainerEl);

    const canvasContainerEl = CanvasContainer.create().mount(document.body);
    const streamStatusService = StreamStatusService.create({ canvasContainerEl, twitchChatObserver });

    const twitchChatService = new TwitchChatService({ chatInputEl, sendMessageButtonEl, streamStatusService });
    const quizService = QuizService.create({ twitchChatObserver, twitchChatService, twitchUser });

    const miniGamesRunner = GameRunner.create({
        twitchChatObserver,
        twitchChatService,
        streamStatusService,
        messagePattern: MessageTemplates.MINI_GAME_REWARD,
        generateMessagesDelay: () => twitchUser.getMiniGamesDelay(),
        commands: [Commands.BATTLEROYALE, Commands.GAUNTLET],
        roundDuration: 15 * Timing.MINUTE
    });

    const hitsquadGameRunner = GameRunner.create({
        twitchChatObserver,
        twitchChatService,
        streamStatusService,
        messagePattern: MessageTemplates.HITSQUAD_REWARD,
        generateMessagesDelay: () => twitchUser.getHitsquadDelay(),
        commands: [Commands.HITSQUAD],
        roundDuration: 60 * Timing.MINUTE
    });

    ExtensionContainer.create({
        streamStatusService,
        quizService,
        twitchChatService,
        miniGamesRunner,
        hitsquadGameRunner
    }).mount(document.body);
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
