import './style.css';
import template from './template.html?raw';
import { config } from '../../consts';

export class ExtensionContainer {
    static create({
        commandsProcessor, streamService, quizService, twitchChatService
    }) {
        return new ExtensionContainer({
            commandsProcessor, streamService, quizService, twitchChatService
        });
    }

    #el;
    #timerEl;
    #commandsProcessor;
    #streamService;
    #quizService;
    _twitchChatService;
    #nextRoundTime;
    #shouldProcessCommands = true;

    constructor({
        commandsProcessor, streamService, quizService, twitchChatService
    }) {
        this.#el = this._createElement();
        this.#commandsProcessor = commandsProcessor;
        this.#streamService = streamService;
        this.#quizService = quizService;
        this._twitchChatService = twitchChatService;

        this.#timerEl = this.el.querySelector('[data-timer]');

        setInterval(() => this._processRound(), config.intervalBetweenRounds);

        this._processRound();
        this._renderTimer();
        this._listenEvents();
        this._renderChecksResult();

        this.#quizService.start();
    }

    _listenEvents() {
        const toggleMessagesEl = this.el.querySelector('[data-toggle-messages]');

        toggleMessagesEl.addEventListener('change', ({ target }) => {
            this.#shouldProcessCommands = target.checked;
        });

        const toggleQuizEl = this.el.querySelector('[data-toggle-quiz]');

        toggleQuizEl.addEventListener('change', ({ target }) => {
            if (target.checked) {
                return this.#quizService.start();
            }

            return this.#quizService.stop();
        });

        this.#streamService.events.on('check', () => {
            this._renderChecksResult();
        });

        this.el.addEventListener('click', ({ target }) => {
            const { command } = target.dataset;

            if (command) {
                this._twitchChatService.sendMessage(command);
            }
        });
    }

    async _processRound() {
        const isBan = this.#streamService.isBanPhase;

        this.#nextRoundTime = Date.now() + config.intervalBetweenRounds;
        this._toggleStatusClass(isBan);
        this._renderRound();

        if (isBan || !this.#shouldProcessCommands) {
            return null;
        }

        return this.#commandsProcessor.processCommandsQueue();
    }

    get el() {
        return this.#el;
    }

    mount(rootEl) {
        rootEl.appendChild(this.el);
        return this.el;
    }

    _renderRound() {
        this.el.querySelector('[data-round]').textContent = `[${this.#commandsProcessor.round}]`;
    }

    _toggleStatusClass(isBan) {
        this.el.classList.toggle('haf-extension-container--ban-phase', isBan);
        this.el.classList.toggle('haf-extension-container--no-ban-phase', !isBan);
    }

    _createElement() {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild;
    }

    _renderTimer() {
        this._updateTimer();
        setInterval(() => this._updateTimer(), 1000);
    }

    _updateTimer() {
        if (!this.#nextRoundTime) {
            return;
        }

        const diff = Math.ceil((this.#nextRoundTime - Date.now()) / 1000);
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;

        this.#timerEl.textContent = `(${this._formatNumber(minutes)}:${this._formatNumber(seconds)})`;
    }

    _formatNumber(n) {
        return n < 10 ? `0${n}` : n;
    }

    _renderChecksResult() {
        const successfulChecksEl = this.el.querySelector('[data-successful-checks]');
        const totalChecksEl = this.el.querySelector('[data-total-checks]');

        const { successfulChecks, totalChecks } = this.#streamService.lastCheckData;

        successfulChecksEl.textContent = successfulChecks;
        totalChecksEl.textContent = totalChecks;
    }
}
