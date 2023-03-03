import './style.css';
import { CommandsProcessor, StreamService, TwitchService } from './services';
import { CanvasContainer } from './views/canvasContainer/CanvasContainer';
import { ExtensionContainer } from './views/extensionContainer/ExtensionContainer';

function getElements() {
    const playerEl = document.querySelector('.persistent-player');
    const chatInputEl = document.querySelector('[data-a-target="chat-input"]');
    const sendMessageButtonEl = document.querySelector('[data-a-target="chat-send-button"]');

    return { playerEl, chatInputEl, sendMessageButtonEl };
}

const intervalId = setInterval(() => {
    const { playerEl, chatInputEl, sendMessageButtonEl } = getElements();

    if (playerEl && chatInputEl && sendMessageButtonEl) {
        clearInterval(intervalId);
        // eslint-disable-next-line no-use-before-define
        setTimeout(() => runApp(), 2000);
    }
}, 1000);

function runApp() {
    const canvasContainerEl = CanvasContainer.create().mount(document.body);
    const { playerEl, chatInputEl, sendMessageButtonEl } = getElements();

    const twitchService = new TwitchService({ chatInputEl, sendMessageButtonEl });
    const streamService = new StreamService({ canvasContainerEl, playerEl });
    const commandsProcessor = new CommandsProcessor({ twitchService });

    ExtensionContainer.create({ commandsProcessor, streamService }).mount(document.body);
}
