import './style.css';
import template from './template.html?raw';
import { Timing, Commands } from '../../consts';
import { promisifiedSetTimeout } from '../../utils';
import { TwitchPlayerService } from '../../services/TwitchPlayerService';

export class ExtensionContainer {
    static create(params) {
        return new ExtensionContainer(params);
    }

    #el;
    #streamStatusService;
    #twitchChatService;
    #miniGamesRunner;
    #hitsquadGameRunner;

    constructor({
        streamStatusService, twitchChatService, miniGamesRunner, hitsquadGameRunner
    }) {
        this.#el = this.#createElement();
        this.#streamStatusService = streamStatusService;
        this.#twitchChatService = twitchChatService;
        this.#miniGamesRunner = miniGamesRunner;
        this.#hitsquadGameRunner = hitsquadGameRunner;

        this.#listenEvents();
        this.#renderChecksResult();
        this.#toggleStatusClass();
    }

    #listenEvents() {
        const toggleGamesEl = this.el.querySelector('[data-toggle-games]');

        toggleGamesEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#miniGamesRunner.start() : this.#miniGamesRunner.stop();
            target.checked ? this.#hitsquadGameRunner.start() : this.#hitsquadGameRunner.stop();
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

        window.document.addEventListener('keydown', (event) => {
            const command = `!answer${event.key}`;

            if (Commands.getAnswers().includes(command)) {
                this.#twitchChatService.sendMessage(command, event.altKey && event.ctrlKey);
            }
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
