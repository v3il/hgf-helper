export class GameRunner {
    static create(params) {
        return new GameRunner(params);
    }

    #completedGamesCount = 0;

    #twitchChatObserver;
    #twitchChatService;
    #streamStatusService;
    #waiterService;

    #messagePattern;
    #responseDelay;
    #commands;

    constructor({
        twitchChatObserver,
        twitchChatService,
        streamStatusService,
        waiterService,
        messagePattern,
        responseDelay,
        commands
    }) {
        this.#twitchChatObserver = twitchChatObserver;
        this.#twitchChatService = twitchChatService;
        this.#streamStatusService = streamStatusService;
        this.#waiterService = waiterService;

        this.#messagePattern = messagePattern;
        this.#responseDelay = responseDelay;
        this.#commands = commands;

        this.#listenEvents();
        this.#startNewRound();
    }

    #listenEvents() {
        this.#twitchChatObserver.events.on('message', ({ userName, message }) => {
            this.#processMessage({ userName, message });
        });
    }

    #processMessage({ userName, message }) {
        if (userName === 'hitsquadgodfather' && message.includes(this.#messagePattern)) {
            this.#completedGamesCount++;
        }

        if (this.#completedGamesCount === this.#commands.length) {
            this.#completedGamesCount = 0;
            this.#startNewRound();
        }
    }

    async #startNewRound() {
        if (this.#streamStatusService.isBanPhase) {
            await this.#waiterService.wait(5 * 60 * 1000);
        }

        this.#sendCommands();
    }

    async #sendCommands() {
        await this.#waiterService.wait(this.#responseDelay);

        for (const command of this.#commands) {
            this.#twitchChatService.sendMessage(command);
            await this.#waiterService.wait(3000);
        }
    }
}
