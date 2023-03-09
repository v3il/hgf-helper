import {
    CommandsProcessor, StreamService, TwitchChatService, QuizService
} from './services';
import { CanvasContainer, ExtensionContainer } from './views';
import { EventEmitter } from './EventsEmitter';

function getTwitchElements() {
    const mediaPlayerEl = document.querySelector('.persistent-player');
    const chatInputEl = document.querySelector('[data-a-target="chat-input"]');
    const sendMessageButtonEl = document.querySelector('[data-a-target="chat-send-button"]');
    const chatContainerEl = document.querySelector('.chat-scrollable-area__message-container');

    return [mediaPlayerEl, chatInputEl, sendMessageButtonEl, chatContainerEl];
}

async function runApp([mediaPlayerEl, chatInputEl, sendMessageButtonEl, chatContainerEl]) {
    const canvasContainerEl = CanvasContainer.create().mount(document.body);

    const streamService = new StreamService({
        canvasContainerEl,
        mediaPlayerEl,
        events: EventEmitter.create()
    });

    await streamService.checkBanPhase();

    const twitchChatService = new TwitchChatService({ chatInputEl, sendMessageButtonEl, streamService });
    const commandsProcessor = new CommandsProcessor({ twitchService: twitchChatService });
    const quizService = new QuizService({ chatContainerEl, twitchChatService });

    ExtensionContainer.create({
        commandsProcessor,
        streamService,
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
