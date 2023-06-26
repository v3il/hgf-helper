import {
    StreamStatusService, TwitchChatService, TwitchChatObserver, GameRunner, TwitchPlayerService, HitsquadRunner
} from './services';
import { CanvasContainer, ExtensionContainer } from './views';
import { Commands, MessageTemplates, Timing } from './consts';
import { generateMiniGameDelay } from './utils';
import { users } from './users';
import { TwitchUser } from './models';

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
    const twitchChatObserver = TwitchChatObserver.create(chatContainerEl);
    const twitchPlayerService = TwitchPlayerService.create();

    const canvasContainerEl = CanvasContainer.create().mount(document.body);

    const streamStatusService = StreamStatusService.create({
        canvasContainerEl,
        twitchChatObserver,
        twitchPlayerService
    });

    const twitchChatService = new TwitchChatService({ chatInputEl, sendMessageButtonEl, streamStatusService });

    // const miniGamesRunner = GameRunner.create({
    //     twitchChatObserver,
    //     twitchChatService,
    //     streamStatusService,
    //     messagePattern: MessageTemplates.HITSQUAD_REWARD,
    //     generateMessagesDelay: () => generateMiniGameDelay(),
    //     commands: [Commands.HITSQUAD],
    //     roundDuration: 15 * Timing.MINUTE
    // });

    const hitsquadRunner = HitsquadRunner.create({
        twitchChatObserver,
        twitchChatService,
        streamStatusService
    });

    ExtensionContainer.create({
        hitsquadRunner,
        streamStatusService,
        twitchChatService
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
