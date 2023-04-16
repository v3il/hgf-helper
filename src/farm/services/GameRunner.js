import { shuffleArray } from '../utils';
import { HGF_USERNAME } from '../farmConfig';
import { WaiterService } from './WaiterService';

export class GameRunner {
    static create(params) {
        return new GameRunner(params);
    }

    static #BAN_PHASE_DELAY = 6 * 60 * 1000;
    static #DELAY_BETWEEN_COMMANDS = 3 * 1000;

    #completedGamesCount = 0;

    #twitchChatObserver;
    #twitchChatService;
    #streamStatusService;

    #messagePattern;
    #responseDelay;
    #commands;
    #roundDuration;

    #isPaused = false;

    constructor({
        twitchChatObserver,
        twitchChatService,
        streamStatusService,
        messagePattern,
        responseDelay,
        commands,
        roundDuration
    }) {
        this.#twitchChatObserver = twitchChatObserver;
        this.#twitchChatService = twitchChatService;
        this.#streamStatusService = streamStatusService;

        this.#messagePattern = messagePattern;
        this.#responseDelay = responseDelay;
        this.#commands = commands;
        this.#roundDuration = roundDuration;

        this.#listenEvents();

        if (this.#shouldProcessInitialRound) {
            this.#startNewRound();
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

    #listenEvents() {
        this.#twitchChatObserver.events.on('message', ({ userName, message }) => {
            this.#processMessage({ userName, message });
        });
    }

    #processMessage({ userName, message }) {
        if (this.#isPaused) {
            return;
        }

        if (userName === HGF_USERNAME && message.includes(this.#messagePattern)) {
            this.#completedGamesCount++;
        }

        if (this.#completedGamesCount === this.#commands.length) {
            this.#completedGamesCount = 0;
            this.#startNewRound();
        }
    }

    async #startNewRound() {
        if (this.#streamStatusService.isBanPhase) {
            await WaiterService.instance.wait(GameRunner.#BAN_PHASE_DELAY);
        }

        this.#sendCommands();
    }

    async #sendCommands() {
        await WaiterService.instance.waitFixedTime(this.#responseDelay);

        for (const command of shuffleArray(this.#commands)) {
            this.#twitchChatService.sendMessage(command);
            await WaiterService.instance.wait(GameRunner.#DELAY_BETWEEN_COMMANDS, 1000);
        }

        this.#setLastCommandTime();
    }

    start() {
        this.#isPaused = false;
    }

    stop() {
        this.#isPaused = true;
    }
}
