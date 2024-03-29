import { generateMiniGameDelay } from '@/farm/utils';
import {
    Commands, MessageTemplates, Timing, GlobalVariables
} from '@/farm/consts';
import { promisifiedSetTimeout } from '@/shared/utils';

export class HitsquadRunner {
    static #ENTRIES_COUNT_TARGET = GlobalVariables.HITSQUAD_GAMES_ON_SCREEN - 3;

    #chatFacade;
    #streamFacade;

    #isPaused = true;
    #completedGamesCount = 0;

    constructor({ chatFacade, streamFacade }) {
        this.#chatFacade = chatFacade;
        this.#streamFacade = streamFacade;

        this.#listenEvents();
    }

    #listenEvents() {
        this.#chatFacade.observeChat((data) => {
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

        if (!this.#streamFacade.isAllowedToSendMessage) {
            await promisifiedSetTimeout(20 * Timing.SECOND);
            return this.#sendCommands();
        }

        this.#chatFacade.sendMessage(Commands.HITSQUAD);
    }

    start() {
        this.#isPaused = false;
    }

    stop() {
        this.#isPaused = true;
        this.#completedGamesCount = 0;
    }
}
