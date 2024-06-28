import { generateDelay } from '@/farm/utils';
import {
    Commands, MessageTemplates, Timing, GlobalVariables
} from '@/farm/consts';
import { promisifiedSetTimeout } from '@/shared/utils';

export class HitsquadRunner {
    static #GAMES_UNTIL_COMMAND = GlobalVariables.HITSQUAD_GAMES_ON_SCREEN - 3;

    #chatFacade;
    #streamFacade;
    #events;

    #counter = { totalRounds: 0, roundsUntilCommand: 0 };

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
            this.#counter.totalRounds--;
            this.#counter.roundsUntilCommand--;
        }

        if (this.#counter.totalRounds <= 0) {
            this.stop();
            this.#events.emit('hitsquadRunner:stop');

            if (this.#counter.roundsUntilCommand < HitsquadRunner.#GAMES_UNTIL_COMMAND) {
                this.#queueCommandSend();
            }

            return;
        }

        if (this.#counter.roundsUntilCommand === 0) {
            this.#counter.roundsUntilCommand = HitsquadRunner.#GAMES_UNTIL_COMMAND;
            this.#queueCommandSend();
        }
    }

    async #queueCommandSend() {
        await promisifiedSetTimeout(this.#generateDelay());
        await this.#sendCommand();
    }

    #generateDelay() {
        return generateDelay(30 * Timing.SECOND, 2 * Timing.MINUTE);
    }

    async #sendCommand() {
        if (!this.#streamFacade.isAllowedToSendMessage) {
            await promisifiedSetTimeout(20 * Timing.SECOND);
            return this.#sendCommand();
        }

        this.#chatFacade.sendMessage(Commands.HITSQUAD);
    }

    start({ totalRounds }) {
        this.#counter = { totalRounds, roundsUntilCommand: HitsquadRunner.#GAMES_UNTIL_COMMAND };
        this.#listenEvents();
    }

    stop() {
        this.#unsubscribe?.();
    }
}
