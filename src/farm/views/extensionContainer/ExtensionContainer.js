import './style.css';
import template from './template.html?raw';

export class ExtensionContainer {
    static create({ streamStatusService, quizService, twitchChatService }) {
        return new ExtensionContainer({
            streamStatusService, quizService, twitchChatService
        });
    }

    #el;
    #streamStatusService;
    #quizService;
    #twitchChatService;

    constructor({ streamStatusService, quizService, twitchChatService }) {
        this.#el = this.#createElement();
        this.#streamStatusService = streamStatusService;
        this.#quizService = quizService;
        this.#twitchChatService = twitchChatService;

        this.#listenEvents();
        this.#renderChecksResult();
    }

    #listenEvents() {
        const toggleQuizEl = this.el.querySelector('[data-toggle-quiz]');

        toggleQuizEl.addEventListener('change', ({ target }) => {
            if (target.checked) {
                return this.#quizService.start();
            }

            return this.#quizService.stop();
        });

        this.#streamStatusService.events.on('check', () => {
            this.#renderChecksResult();
            this.#toggleStatusClass(this.#streamStatusService.isBanPhase);
        });

        window.document.addEventListener('keydown', (e) => {
            const isAnswerKey = ['1', '2', '3', '4'].includes(e.key);

            if (isAnswerKey) {
                console.error('Send', `!answer${e.key}`);
                this.#twitchChatService.sendMessage(`!answer${e.key}`);
            }
        });
    }

    get el() {
        return this.#el;
    }

    mount(rootEl) {
        rootEl.appendChild(this.el);
        return this.el;
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
