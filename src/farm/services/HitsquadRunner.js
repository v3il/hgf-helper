import {
    generateDelay, generateMiniGameDelay, promisifiedSetTimeout, shuffleArray
} from '../utils';
import { Commands, MessageTemplates, Timing } from '../consts';

export class HitsquadRunner {
    static create(params) {
        return new HitsquadRunner(params);
    }

    static #BAN_PHASE_DELAY = 30 * 1000;

    #round = 0;
    #completedGamesCount = 0;
    #commandsEntered = 0;

    #twitchChatObserver;
    #twitchChatService;
    #streamStatusService;

    #commands;

    #isPaused = false;

    constructor({
        twitchChatObserver,
        twitchChatService,
        streamStatusService,
        commands
    }) {
        this.#twitchChatObserver = twitchChatObserver;
        this.#twitchChatService = twitchChatService;
        this.#streamStatusService = streamStatusService;

        this.#commands = commands;

        this.#listenEvents();

        if (this.#shouldProcessInitialRound) {
            this.#startNewRound();
        } else {
            this.#round = 1;
        }
    }

    get #serviceId() {
        return `gr_${this.#commands.join('_')}`;
    }

    get #lastCommandTime() {
        const value = localStorage.getItem(this.#serviceId);
        return value ? Number.parseInt(value, 10) : 0;
    }

    #setLastCommandTime() {
        localStorage.setItem(this.#serviceId, Date.now());
    }

    get #shouldProcessInitialRound() {
        return false; // Date.now() - this.#lastCommandTime >= 30 * Timing.MINUTE;
    }

    get #roundDelay() {
        return this.#round === 0 ? 5 * Timing.SECOND : generateMiniGameDelay();
    }

    #listenEvents() {
        this.#twitchChatObserver.events.on('message', ({ message, isAdmin }) => {
            this.#processMessage({ message, isAdmin });
        });
    }

    #processMessage({ message, isAdmin }) {
        if (this.#isPaused) {
            return;
        }

        const isGameCommand = this.#commands.some((command) => message.startsWith(command));

        if (isGameCommand) {
            this.#commandsEntered++;
        }

        // console.error(message, message.includes(MessageTemplates.HITSQUAD_REWARD));

        if (isAdmin && message.includes(MessageTemplates.HITSQUAD_REWARD)) {
            this.#completedGamesCount++;
        }

        if (this.#completedGamesCount > 0 && this.#completedGamesCount % 3 === 0) {
            console.error(this.#completedGamesCount, 'Send');

            const isStreamBotWorking = this.#commandsEntered >= this.#commands.length * 15;

            this.#completedGamesCount = 0;
            this.#commandsEntered = 0;

            if (this.#round > 1 && !isStreamBotWorking) {
                return;
            }

            // console.error(this.#round);

            this.#round++;

            this.#startNewRound();
        }
    }

    async #startNewRound() {
        await promisifiedSetTimeout(this.#roundDelay);
        await this.#sendCommands();
    }

    async #sendCommands() {
        if (this.#streamStatusService.isBanPhase) {
            await promisifiedSetTimeout(HitsquadRunner.#BAN_PHASE_DELAY);
            return this.#sendCommands();
        }

        this.#twitchChatService.sendMessage(Commands.HITSQUAD);
        this.#setLastCommandTime();
    }

    start() {
        this.#isPaused = false;
    }

    stop() {
        this.#isPaused = true;
    }
}
