import { Container } from 'typedi';
import { generateMiniGameDelay, promisifiedSetTimeout } from '../utils';
import { Commands, InjectionTokens, MessageTemplates } from '../consts';

export class HitsquadRunner {
    static create() {
        const twitchChatObserver = Container.get(InjectionTokens.CHAT_OBSERVER);
        const twitchChatService = Container.get(InjectionTokens.CHAT_SERVICE);
        const streamStatusService = Container.get(InjectionTokens.STREAM_STATUS_SERVICE);

        return new HitsquadRunner({
            twitchChatObserver,
            twitchChatService,
            streamStatusService
        });
    }

    static #BAN_PHASE_DELAY = 30 * 1000;
    static #HITSQUAD_ENTRIES_ON_SCREEN = 25;
    static #ENTRIES_COUNT_TARGET = Math.floor(HitsquadRunner.#HITSQUAD_ENTRIES_ON_SCREEN / 2);

    #completedGamesCount = 0;

    #twitchChatObserver;
    #twitchChatService;
    #streamStatusService;

    #isPaused = true;

    constructor({ twitchChatObserver, twitchChatService, streamStatusService }) {
        this.#twitchChatObserver = twitchChatObserver;
        this.#twitchChatService = twitchChatService;
        this.#streamStatusService = streamStatusService;

        this.#listenEvents();
    }

    #listenEvents() {
        this.#twitchChatObserver.events.on('message', (data) => {
            if (!this.#isPaused) {
                this.#processMessage(data);
            } else {
                this.#completedGamesCount = 0;
            }
        });
    }

    #processMessage({ message, isSystemMessage }) {
        if (isSystemMessage && MessageTemplates.isHitsquadReward(message)) {
            this.#completedGamesCount++;
        }

        if (this.#completedGamesCount > 0 && this.#completedGamesCount % HitsquadRunner.#ENTRIES_COUNT_TARGET === 0) {
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
        this.#completedGamesCount = 0;
    }
}
