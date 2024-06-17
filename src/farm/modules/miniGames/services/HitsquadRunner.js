import { generateMiniGameDelay } from '@/farm/utils';
import {
    Commands, MessageTemplates, Timing, GlobalVariables
} from '@/farm/consts';
import { promisifiedSetTimeout } from '@/shared/utils';

export class HitsquadRunner {
    static #GAMES_UNTIL_COMMAND = GlobalVariables.HITSQUAD_GAMES_ON_SCREEN - 3;

    #chatFacade;
    #streamFacade;
    #events;

    #isStopped = true;
    #gamesUntilCommand = 0;
    #totalGamesCount = 0;

    #unsubscribe;

    constructor({ chatFacade, streamFacade, events }) {
        this.#chatFacade = chatFacade;
        this.#streamFacade = streamFacade;
        this.#events = events;
    }

    get events() {
        return this.#events;
    }

    #listenEvents() {
        this.#unsubscribe = this.#chatFacade.observeChat((data) => {
            this.#processMessage(data);
        });
    }

    async #processMessage({ message, isSystemMessage }) {
        if (isSystemMessage && MessageTemplates.isHitsquadReward(message)) {
            this.#gamesUntilCommand--;
            this.#totalGamesCount--;
        }

        if (this.#totalGamesCount <= 0) {
            this.stop();
            this.#events.emit('hitsquadRunner:stop');

            if (this.#gamesUntilCommand !== HitsquadRunner.#GAMES_UNTIL_COMMAND) {
                this.#queueCommandSend();
            }

            return;
        }

        if (this.#gamesUntilCommand === 0) {
            this.#gamesUntilCommand = HitsquadRunner.#GAMES_UNTIL_COMMAND;
            this.#queueCommandSend();
        }
    }

    async #queueCommandSend() {
        await promisifiedSetTimeout(generateMiniGameDelay());
        await this.#sendCommands();
    }

    async #sendCommands() {
        if (this.#isStopped) {
            return;
        }

        if (!this.#streamFacade.isAllowedToSendMessage) {
            await promisifiedSetTimeout(20 * Timing.SECOND);
            return this.#sendCommands();
        }

        this.#chatFacade.sendMessage(Commands.HITSQUAD);
    }

    start({ gamesCount }) {
        this.#totalGamesCount = gamesCount;
        this.#gamesUntilCommand = HitsquadRunner.#GAMES_UNTIL_COMMAND;
        this.#isStopped = false;
        this.#listenEvents();
    }

    stop() {
        this.#isStopped = true;
        this.#gamesUntilCommand = 0;
        this.#unsubscribe?.();
    }
}
