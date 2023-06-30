import { Container } from 'typedi';
import {
    generateDelay, generateMiniGameDelay, promisifiedSetTimeout, shuffleArray
} from '../utils';
import {
    Commands, InjectionTokens, MessageTemplates, Timing
} from '../consts';

export class HitsquadRunner {
    static create() {
        const twitchChatObserver = Container.get(InjectionTokens.CHAT_OBSERVER);
        const twitchChatService = Container.get(InjectionTokens.CHAT_SERVICE);
        const streamStatusService = Container.get(InjectionTokens.STREAM_STATUS_SERVICE);

        return new HitsquadRunner({ twitchChatObserver, twitchChatService, streamStatusService });
    }

    static #BAN_PHASE_DELAY = 30 * 1000;

    #completedGamesCount = 0;

    #twitchChatObserver;
    #twitchChatService;
    #streamStatusService;

    #isPaused = true;

    constructor({ twitchChatObserver, twitchChatService, streamStatusService }) {
        this.#twitchChatObserver = twitchChatObserver;
        this.#twitchChatService = twitchChatService;
        this.#streamStatusService = streamStatusService;

        // const t = Container.get(InjectionTokens.TWITCH_USER);
        //
        // console.error(2, t.name);

        this.#listenEvents();
    }

    #listenEvents() {
        this.#twitchChatObserver.events.on('message', (data) => {
            if (!this.#isPaused) {
                this.#processMessage(data);
            }
        });
    }

    #processMessage({ message, isSystemMessage }) {
        if (isSystemMessage && message.includes(MessageTemplates.HITSQUAD_REWARD)) {
            this.#completedGamesCount++;
        }

        if (this.#completedGamesCount > 0 && this.#completedGamesCount % 3 === 0) {
            this.#completedGamesCount = 0;
            this.#startNewRound();
        }
    }

    async #startNewRound() {
        await promisifiedSetTimeout(generateMiniGameDelay());
        await this.#sendCommands();
    }

    async #sendCommands() {
        if (this.#isPaused) {
            return;
        }

        if (this.#streamStatusService.isBanPhase) {
            await promisifiedSetTimeout(HitsquadRunner.#BAN_PHASE_DELAY);
            return this.#sendCommands();
        }

        this.#twitchChatService.sendMessage(Commands.HITSQUAD);
    }

    start() {
        this.#isPaused = false;
    }

    stop() {
        this.#isPaused = true;
    }
}
