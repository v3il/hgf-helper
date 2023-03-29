import {
    CommandsProcessor, StreamStatusService, TwitchChatService, QuizService, TwitchChatObserver
} from './services';
import { CanvasContainer, ExtensionContainer } from './views';
import { EventEmitter } from './models/EventsEmitter';
import { TwitchUser } from './models';

function getTwitchElements() {
    const userDropdownToggleEl = document.querySelector('[data-a-target="user-menu-toggle"]');

    userDropdownToggleEl?.click();

    const chatInputEl = document.querySelector('[data-a-target="chat-input"]');
    const sendMessageButtonEl = document.querySelector('[data-a-target="chat-send-button"]');
    const chatContainerEl = document.querySelector('.chat-scrollable-area__message-container');
    const videoEl = document.querySelector('video');
    const userNameEl = document.querySelector('[data-a-target="user-display-name"]');

    userDropdownToggleEl?.click();

    return [chatInputEl, sendMessageButtonEl, chatContainerEl, videoEl, userNameEl];
}

async function runApp([chatInputEl, sendMessageButtonEl, chatContainerEl, videoEl, userNameEl]) {
    const userName = userNameEl.textContent.toLowerCase();

    const twitchUser = TwitchUser.create({ userName });
    const twitchChatObserver = TwitchChatObserver.create(chatContainerEl);

    const canvasContainerEl = CanvasContainer.create().mount(document.body);

    const streamStatusService = new StreamStatusService({
        canvasContainerEl,
        videoEl,
        events: EventEmitter.create()
    });

    await streamStatusService.checkBanPhase();

    const twitchChatService = new TwitchChatService({ chatInputEl, sendMessageButtonEl, streamStatusService });
    const commandsProcessor = new CommandsProcessor({ twitchService: twitchChatService });
    const quizService = QuizService.create({ twitchChatObserver, twitchChatService, twitchUser });

    ExtensionContainer.create({
        commandsProcessor,
        streamStatusService,
        quizService,
        twitchChatService
    }).mount(document.body);
}

const intervalId = setInterval(() => {
    const twitchElements = getTwitchElements();
    const isAllElementsExist = twitchElements.every((element) => element !== null);

    if (isAllElementsExist) {
        clearInterval(intervalId);
        setTimeout(() => runApp(twitchElements), 5000);
    }
}, 1000);
