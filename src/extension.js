import {
    CommandsProcessor, StreamStatusService, TwitchChatService, QuizService
} from './services';
import { CanvasContainer, ExtensionContainer } from './views';
import { EventEmitter } from './EventsEmitter';

function getTwitchElements() {
    const chatInputEl = document.querySelector('[data-a-target="chat-input"]');
    const sendMessageButtonEl = document.querySelector('[data-a-target="chat-send-button"]');
    const chatContainerEl = document.querySelector('.chat-scrollable-area__message-container');
    const videoEl = document.querySelector('video');

    return [chatInputEl, sendMessageButtonEl, chatContainerEl, videoEl];
}

async function runApp([chatInputEl, sendMessageButtonEl, chatContainerEl, videoEl]) {
    const canvasContainerEl = CanvasContainer.create().mount(document.body);

    const streamStatusService = new StreamStatusService({
        canvasContainerEl,
        videoEl,
        events: EventEmitter.create()
    });

    await streamStatusService.checkBanPhase();

    const twitchChatService = new TwitchChatService({ chatInputEl, sendMessageButtonEl, streamStatusService });
    const commandsProcessor = new CommandsProcessor({ twitchService: twitchChatService });
    const quizService = new QuizService({ chatContainerEl, twitchChatService });

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
