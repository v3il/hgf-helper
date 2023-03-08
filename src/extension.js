import {
    CommandsProcessor, StreamService, TwitchChatService, QuizService
} from './services';
import { CanvasContainer, ExtensionContainer } from './views';

function getTwitchElements() {
    const mediaPlayerEl = document.querySelector('.persistent-player');
    const chatInputEl = document.querySelector('[data-a-target="chat-input"]');
    const sendMessageButtonEl = document.querySelector('[data-a-target="chat-send-button"]');
    const chatContainerEl = document.querySelector('.chat-scrollable-area__message-container');

    return [mediaPlayerEl, chatInputEl, sendMessageButtonEl, chatContainerEl];
}

function runApp([mediaPlayerEl, chatInputEl, sendMessageButtonEl, chatContainerEl]) {
    const canvasContainerEl = CanvasContainer.create().mount(document.body);

    const twitchService = new TwitchChatService({ chatInputEl, sendMessageButtonEl });
    const streamService = new StreamService({ canvasContainerEl, mediaPlayerEl });
    const commandsProcessor = new CommandsProcessor({ twitchService });

    const quizService = new QuizService({
        chatContainerEl,
        streamService,
        twitchService
    });

    ExtensionContainer.create({ commandsProcessor, streamService, quizService }).mount(document.body);
}

const intervalId = setInterval(() => {
    const twitchElements = getTwitchElements();
    const isAllElementsExist = twitchElements.every((element) => element !== null);

    if (isAllElementsExist) {
        clearInterval(intervalId);
        setTimeout(() => runApp(twitchElements), 2000);
    }
}, 1000);
