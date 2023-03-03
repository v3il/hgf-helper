import './style.css';

import { config } from './config';
import { TwitchService, StreamService, CommandsProcessor } from './services';
import { promisifiedSetTimeout } from './utils/promisifiedSetTimeout';
import { getFormattedDate } from './utils/getFormattedDate';
import { CanvasContainer } from './views/canvasContainer/CanvasContainer';

const intervalId = setInterval(() => {
    // eslint-disable-next-line no-use-before-define
    const { playerEl, chatInputEl, sendMessageButtonEl } = getElements();

    if (playerEl && chatInputEl && sendMessageButtonEl) {
        clearInterval(intervalId);
        // eslint-disable-next-line no-use-before-define
        setTimeout(() => runApp(), 2000);
    }
}, 1000);

function runApp() {
    const canvasContainerEl = CanvasContainer.create().mount(document.body);
    // eslint-disable-next-line no-use-before-define
    const { playerEl, chatInputEl, sendMessageButtonEl } = getElements();

    const twitchService = new TwitchService({ chatInputEl, sendMessageButtonEl });
    const streamService = new StreamService({ canvasContainerEl, playerEl });
    const commandsProcessor = new CommandsProcessor({ twitchService });

    setInterval(() => {
        commandsProcessor.processCommandsQueue();
        // processRound({ twitchService, streamService });
    }, config.intervalBetweenRounds);

    commandsProcessor.processCommandsQueue();

    // processRound({ twitchService, streamService });
}

// async function processRound({ twitchService, streamService }) {
//     console.log('\n\n---------------------------------\n\n');
//
//     const isBanPhase = await streamService.isBanPhase();
//
//     console.error('Is ban: ', isBanPhase, ' | ', getFormattedDate());
//
//     if (isBanPhase) {
//         return;
//     }
//
//     for (const command of config.commands) {
//         const delay = config.intervalBetweenCommands + Math.random() * 1000 + 1000;
//         await promisifiedSetTimeout(delay);
//         // twitchService.sendMessage(command);
//     }
// }

function getElements() {
    const playerEl = document.querySelector('.persistent-player');
    const chatInputEl = document.querySelector('[data-a-target="chat-input"]');
    const sendMessageButtonEl = document.querySelector('[data-a-target="chat-send-button"]');

    return { playerEl, chatInputEl, sendMessageButtonEl };
}
