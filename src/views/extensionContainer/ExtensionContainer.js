import './style.css';
import template from './template.html?raw';
import { config } from '../../consts/config';

export class ExtensionContainer {
    static create({ commandsProcessor, streamService }) {
        return new ExtensionContainer({ commandsProcessor, streamService });
    }

    #el;
    #commandsProcessor;
    #streamService;
    #nextRoundTime;
    #shouldProcessCommands = true;

    constructor({ commandsProcessor, streamService }) {
        this.#el = this._createElement();
        this.#commandsProcessor = commandsProcessor;
        this.#streamService = streamService;

        setInterval(() => {
            this._processRound();
        }, config.intervalBetweenRounds);

        this._processRound();
        this._renderClock();

        this.el.querySelector('[data-toggle-messages]').addEventListener('change', ({ target }) => {
            this.#shouldProcessCommands = target.checked;
        });
    }

    async _processRound() {
        const { successfulChecks, totalChecks, isBan } = await this.#streamService.isBanPhase();

        this.#nextRoundTime = Date.now() + config.intervalBetweenRounds;
        this._renderCheckResult(successfulChecks, totalChecks);
        this._toggleStatusClass(isBan);
        this._renderRound();

        if (isBan || !this.#shouldProcessCommands) {
            return;
        }

        this.#commandsProcessor.processCommandsQueue();
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

    _renderClock() {
        const el = this.el.querySelector('[data-clock]');

        setInterval(() => {
            if (!this.#nextRoundTime) {
                return;
            }

            const diff1 = Math.ceil((this.#nextRoundTime - Date.now()) / 1000);
            const minutes1 = Math.floor(diff1 / 60);
            const seconds1 = diff1 % 60;

            el.textContent = `${this._formatNumber(minutes1)}:${this._formatNumber(seconds1)}`;
        }, 1000);

        if (!this.#nextRoundTime) {
            return;
        }

        const diff = Math.ceil((this.#nextRoundTime - Date.now()) / 1000);
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;

        el.textContent = `${this._formatNumber(minutes)}:${this._formatNumber(seconds)}`;
    }

    _formatNumber(n) {
        return n < 10 ? `0${n}` : n;
    }

    _renderCheckResult(successfulChecks, totalChecks) {
        const successfulChecksEl = this.el.querySelector('[data-successful-checks]');
        const totalChecksEl = this.el.querySelector('[data-total-checks]');

        successfulChecksEl.textContent = successfulChecks;
        totalChecksEl.textContent = totalChecks;
    }
}
