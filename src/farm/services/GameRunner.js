import { generateDelay, promisifiedSetTimeout, shuffleArray } from '../utils';
import { HGF_USERNAME } from '../farmConfig';
import { Timing } from '../consts';

export class GameRunner {
    static create(params) {
        return new GameRunner(params);
    }

    static #BAN_PHASE_DELAY = 30 * 1000;

    #round = 0;
    #completedGamesCount = 0;
    #commandsEntered = 0;

    #twitchChatObserver;
    #twitchChatService;
    #streamStatusService;

    #messagePattern;
    #generateMessagesDelay;
    #commands;
    #roundDuration;

    #isPaused = false;

    constructor({
        twitchChatObserver,
        twitchChatService,
        streamStatusService,
        messagePattern,
        generateMessagesDelay,
        commands,
        roundDuration
    }) {
        this.#twitchChatObserver = twitchChatObserver;
        this.#twitchChatService = twitchChatService;
        this.#streamStatusService = streamStatusService;

        this.#messagePattern = messagePattern;
        this.#generateMessagesDelay = generateMessagesDelay;
        this.#commands = commands;
        this.#roundDuration = roundDuration;

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
        return Date.now() - this.#lastCommandTime >= this.#roundDuration;
    }

    get #roundDelay() {
        return this.#round === 0 ? 5 * Timing.SECOND * this.#commands.length : this.#generateMessagesDelay();
    }

    #listenEvents() {
        this.#twitchChatObserver.events.on('message', ({ userName, message }) => {
            this.#processMessage({ userName, message });
        });
    }

    #processMessage({ userName, message }) {
        if (this.#isPaused) {
            return;
        }

        const isGameCommand = this.#commands.some((command) => message.startsWith(command));

        if (isGameCommand) {
            this.#commandsEntered++;
        }

        if (userName === HGF_USERNAME && message.includes(this.#messagePattern)) {
            this.#completedGamesCount++;
        }

        if (this.#completedGamesCount === this.#commands.length) {
            const a = this.#commandsEntered;
            const isStreamBotWorking = this.#commandsEntered >= this.#commands.length * 15;

            this.#completedGamesCount = 0;
            this.#commandsEntered = 0;

            if (this.#round > 1 && !isStreamBotWorking) {
                return;
            }

            this.#startNewRound();
        }
    }

    async #startNewRound() {
        await promisifiedSetTimeout(this.#roundDelay);
        await this.#sendCommands();
    }

    async #sendCommands() {
        if (this.#streamStatusService.isBanPhase) {
            await promisifiedSetTimeout(GameRunner.#BAN_PHASE_DELAY);
            return this.#sendCommands();
        }

        for (const command of shuffleArray(this.#commands)) {
            const delayBetweenCommands = generateDelay(3 * Timing.SECOND, 8 * Timing.SECOND);

            this.#twitchChatService.sendMessage(command);
            await promisifiedSetTimeout(delayBetweenCommands);
        }

        this.#setLastCommandTime();
        this.#round++;
    }

    start() {
        this.#isPaused = false;
    }

    stop() {
        this.#isPaused = true;
    }
}
