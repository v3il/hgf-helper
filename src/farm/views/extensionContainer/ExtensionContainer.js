import './style.css';
import template from './template.html?raw';
import { Timing } from '../../consts';
import { promisifiedSetTimeout } from '../../utils';

export class ExtensionContainer {
    static create(params) {
        return new ExtensionContainer(params);
    }

    #el;
    #streamStatusService;
    #twitchChatService;
    #miniGamesRunner;

    constructor({ streamStatusService, twitchChatService, miniGamesRunner }) {
        this.#el = this.#createElement();
        this.#streamStatusService = streamStatusService;
        this.#twitchChatService = twitchChatService;
        this.#miniGamesRunner = miniGamesRunner;

        this.#listenEvents();
        this.#renderChecksResult();
        this.#toggleStatusClass();
    }

    #listenEvents() {
        const toggleGamesEl = this.el.querySelector('[data-toggle-games]');

        toggleGamesEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#miniGamesRunner.start() : this.#miniGamesRunner.stop();
        });

        this.#streamStatusService.events.on('check', async () => {
            if (this.#streamStatusService.lastCheckData.isReload) {
                this.#toggleStatusClass();
                await promisifiedSetTimeout(Timing.MINUTE);
                return window.location.reload();
            }

            this.#renderChecksResult();
            this.#toggleStatusClass();
        });
    }

    get el() {
        return this.#el;
    }

    mount(rootEl) {
        rootEl.appendChild(this.el);
    }

    #toggleStatusClass() {
        const { lastCheckData } = this.#streamStatusService;

        if (lastCheckData.isReload) {
            return this.el.classList.add('haf-extension-container--reload');
        }

        this.el.classList.toggle('haf-extension-container--ban-phase', lastCheckData.isBan);
        this.el.classList.toggle('haf-extension-container--no-ban-phase', !lastCheckData.isBan);
    }

    #createElement() {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild;
    }

    #renderChecksResult() {
        const successfulChecksEl = this.el.querySelector('[data-successful-checks]');
        const totalChecksEl = this.el.querySelector('[data-total-checks]');

        const { successfulChecks, totalChecks } = this.#streamStatusService.lastCheckData;

        successfulChecksEl.textContent = successfulChecks;
        totalChecksEl.textContent = totalChecks;
    }
}
