import {
    StreamStatusService,
    TwitchChatService,
    QuizService,
    TwitchChatObserver,
    GameRunner, WaiterService
} from './services';
import { CanvasContainer, ExtensionContainer } from './views';
import { TwitchUser } from './models';
import { Commands, MessageTemplates } from './consts';

function getTwitchElements() {
    const userDropdownToggleEl = document.querySelector('[data-a-target="user-menu-toggle"]');

    userDropdownToggleEl?.click();

    const chatInputEl = document.querySelector('[data-a-target="chat-input"]');
    const sendMessageButtonEl = document.querySelector('[data-a-target="chat-send-button"]');
    const chatContainerEl = document.querySelector('.chat-scrollable-area__message-container');
    const videoEl = document.querySelector('video');
    const userNameEl = document.querySelector('[data-a-target="user-display-name"]');

    userDropdownToggleEl?.click();

    return {
        chatInputEl,
        sendMessageButtonEl,
        chatContainerEl,
        videoEl,
        userNameEl
    };
}

async function runApp({
    chatInputEl, sendMessageButtonEl, chatContainerEl, userNameEl
}) {
    const userName = userNameEl.textContent.toLowerCase();

    const twitchUser = TwitchUser.create({ userName });

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
        responseDelay: 10000,
        commands: [Commands.BATTLEROYALE, Commands.GAUNTLET],
        roundDuration: 15 * 60 * 1000
    });

    const hitsquadGameRunner = GameRunner.create({
        twitchChatObserver,
        twitchChatService,
        streamStatusService,
        messagePattern: MessageTemplates.HITSQUAD_REWARD,
        responseDelay: 60000,
        commands: [Commands.HITSQUAD],
        roundDuration: 60 * 60 * 1000
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
