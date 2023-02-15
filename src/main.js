import './style.css'

import { config } from './config';
import { streamService } from "./services";
// import {TwitchService} from "./services/TwitchService";
// import {StreamService} from "./services/StreamService";

const { commands, interval } = config;

// document.addEventListener("DOMContentLoaded", function() {
//     const containerEl = mountContainerEl();
//     const playerEl = document.querySelector(".persistent-player");
//
//     console.error(containerEl, playerEl);
//
//     const twitchService = new TwitchService();
//     const streamService = new StreamService({ containerEl, playerEl });

    setInterval(async () => {
        const isBanPhase = await streamService.isBanPhase();
        console.error(isBanPhase);
    }, interval);
// });

// function mountContainerEl() {
//     const containerEl = document.createElement('div');
//     containerEl.classList.add('haf-container');
//     document.body.appendChild(containerEl);
//     return containerEl;
// }

