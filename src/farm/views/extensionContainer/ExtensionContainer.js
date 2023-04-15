import './style.css';
import template from './template.html?raw';
import { quizAnswers } from '../../consts';
import { WaiterService } from '../../services';

export class ExtensionContainer {
    static create(params) {
        return new ExtensionContainer(params);
    }

    #el;
    #streamStatusService;
    #quizService;
    #twitchChatService;
    #miniGamesRunner;
    #hitsquadGameRunner;

    constructor({
        streamStatusService, quizService, twitchChatService, miniGamesRunner, hitsquadGameRunner
    }) {
        this.#el = this.#createElement();
        this.#streamStatusService = streamStatusService;
        this.#quizService = quizService;
        this.#twitchChatService = twitchChatService;
        this.#miniGamesRunner = miniGamesRunner;
        this.#hitsquadGameRunner = hitsquadGameRunner;

        this.#listenEvents();
        this.#renderChecksResult();
        this.#toggleStatusClass(this.#streamStatusService.isBanPhase);
    }

    #listenEvents() {
        const toggleGamesEl = this.el.querySelector('[data-toggle-games]');

        toggleGamesEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#miniGamesRunner.start() : this.#miniGamesRunner.stop();
            target.checked ? this.#hitsquadGameRunner.start() : this.#hitsquadGameRunner.stop();
        });

        const toggleQuizEl = this.el.querySelector('[data-toggle-quiz]');

        toggleQuizEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#quizService.start() : this.#quizService.stop();
        });

        this.#streamStatusService.events.on('reload', async () => {
            await WaiterService.instance.waitFixedTime(60 * 1000);
            window.location.reload();
        });

        this.#streamStatusService.events.on('check', () => {
            this.#renderChecksResult();
            this.#toggleStatusClass(this.#streamStatusService.isBanPhase);
        });

        window.document.addEventListener('keydown', (e) => {
            const command = `!answer${e.key}`;

            if (quizAnswers.includes(command)) {
                this.#twitchChatService.sendMessage(command);
            }
        });
    }

    get el() {
        return this.#el;
    }

    mount(rootEl) {
        rootEl.appendChild(this.el);
    }

    #toggleStatusClass(isBan) {
        this.el.classList.toggle('haf-extension-container--ban-phase', isBan);
        this.el.classList.toggle('haf-extension-container--no-ban-phase', !isBan);
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
