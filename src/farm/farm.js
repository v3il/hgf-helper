import {
    StreamStatusService,
    TwitchChatService,
    TwitchChatObserver,
    GameRunner
} from './services';
import { CanvasContainer, ExtensionContainer } from './views';
import { Commands, MessageTemplates, Timing } from './consts';
import { generateHitsquadDelay, generateMiniGameDelay } from './utils';

function getTwitchElements() {
    const chatInputEl = document.querySelector('[data-a-target="chat-input"]');
    const sendMessageButtonEl = document.querySelector('[data-a-target="chat-send-button"]');
    const chatContainerEl = document.querySelector('.chat-scrollable-area__message-container');
    const videoEl = document.querySelector('video');

    return {
        chatInputEl,
        sendMessageButtonEl,
        chatContainerEl,
        videoEl
    };
}

async function runApp({
    chatInputEl, sendMessageButtonEl, chatContainerEl, userDropdownToggleEl
}) {
    const twitchChatObserver = TwitchChatObserver.create(chatContainerEl);

    const canvasContainerEl = CanvasContainer.create().mount(document.body);
    const streamStatusService = StreamStatusService.create({ canvasContainerEl, twitchChatObserver });

    const twitchChatService = new TwitchChatService({ chatInputEl, sendMessageButtonEl, streamStatusService });

    const miniGamesRunner = GameRunner.create({
        twitchChatObserver,
        twitchChatService,
        streamStatusService,
        messagePattern: MessageTemplates.MINI_GAME_REWARD,
        generateMessagesDelay: () => generateMiniGameDelay(),
        checkRoundSkipped: () => false,
        commands: [Commands.BATTLEROYALE, Commands.GAUNTLET],
        roundDuration: 15 * Timing.MINUTE
    });

    const hitsquadGameRunner = GameRunner.create({
        twitchChatObserver,
        twitchChatService,
        streamStatusService,
        messagePattern: MessageTemplates.HITSQUAD_REWARD,
        generateMessagesDelay: () => generateHitsquadDelay(),
        checkRoundSkipped: (round) => round % 3 !== 0,
        commands: [Commands.HITSQUAD],
        roundDuration: 30 * Timing.MINUTE
    });

    ExtensionContainer.create({
        streamStatusService,
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
