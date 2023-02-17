import './style.css'

import { config } from './config';
import { TwitchService, StreamService } from "./services";
import { promisifiedSetTimeout } from "./utils/promisifiedSetTimeout";

const intervalId = setInterval(() => {
    const { playerEl, chatInputEl, sendMessageButtonEl } = getElements();

    if (playerEl && chatInputEl && sendMessageButtonEl) {
        clearInterval(intervalId);
        setTimeout(() => runApp(), 2000);
    }
}, 1000);

function runApp() {
    const containerEl = mountAppContainer();
    const { playerEl, chatInputEl, sendMessageButtonEl } = getElements();

    const twitchService = new TwitchService({ chatInputEl, sendMessageButtonEl });
    const streamService = new StreamService({ containerEl, playerEl });

    setInterval(() => {
        processRound({ twitchService, streamService });
    }, config.intervalBetweenRounds);

    processRound({ twitchService, streamService });
}

async function processRound({ twitchService, streamService }) {
    console.clear();

    const isBanPhase = await streamService.isBanPhase();

    console.error('Is ban', isBanPhase);

    if (isBanPhase) {
        return;
    }

    for (const command of config.commands) {
        const delay = config.intervalBetweenCommands + Math.random() * 1000 + 1000;
        await promisifiedSetTimeout(delay);
        twitchService.sendMessage(command);
    }
}

function mountAppContainer() {
    const containerEl = document.createElement('div');
    containerEl.classList.add('haf-container');
    document.body.appendChild(containerEl);
    return containerEl;
}

function getElements() {
    const playerEl = document.querySelector(".persistent-player");
    const chatInputEl = document.querySelector('[data-a-target="chat-input"]');
    const sendMessageButtonEl = document.querySelector('[data-a-target="chat-send-button"]');

    return { playerEl, chatInputEl, sendMessageButtonEl };
}

