import './style.css';
import { Container } from 'typedi';
import template from './template.html?raw';
import { Commands, InjectionTokens, Timing } from '../../consts';
import { promisifiedSetTimeout } from '../../utils';

export class ExtensionContainer {
    static create() {
        const hitsquadRunner = Container.get(InjectionTokens.HITSQUAD_RUNNER);
        const quizRunner = Container.get(InjectionTokens.QUIZ_RUNNER);
        const twitchChatService = Container.get(InjectionTokens.CHAT_SERVICE);
        const streamStatusService = Container.get(InjectionTokens.STREAM_STATUS_SERVICE);
        const settingsService = Container.get(InjectionTokens.SETTINGS_SERVICE);
        const canvasView = Container.get(InjectionTokens.CANVAS_VIEW);

        return new ExtensionContainer({
            hitsquadRunner, streamStatusService, twitchChatService, settingsService, quizRunner, canvasView
        });
    }

    #el;
    #streamStatusService;
    #twitchChatService;
    #hitsquadRunner;
    #settingsService;
    #quizRunner;
    #canvasView;

    constructor({
        streamStatusService, twitchChatService, hitsquadRunner, settingsService, quizRunner, canvasView
    }) {
        this.#el = this.#createElement();
        this.#streamStatusService = streamStatusService;
        this.#twitchChatService = twitchChatService;
        this.#hitsquadRunner = hitsquadRunner;
        this.#settingsService = settingsService;
        this.#quizRunner = quizRunner;
        this.#canvasView = canvasView;

        this.#listenEvents();
        this.#renderChecksResult();
        this.#toggleStatusClass();
    }

    #listenEvents() {
        this.#handleDebugMode();
        this.#handleQuizCheckbox();
        this.#handleMiniGamesCheckbox();
        this.#handleReloadPage();
        this.#handleKeydownHandler();
        this.#handleHitsquadButton();
    }

    #handleDebugMode() {
        window.document.addEventListener('keydown', (event) => {
            // Ctrl + 0
            if (event.ctrlKey && event.key === '0') {
                event.preventDefault();
                this.#canvasView.toggleDebug();
            }
        });
    }

    #handleMiniGamesCheckbox() {
        const toggleGamesEl = this.el.querySelector('[data-toggle-games]');
        const isHitsquadRunning = this.#settingsService.getSetting('hitsquadRunner');

        toggleGamesEl.checked = isHitsquadRunning;

        if (isHitsquadRunning) {
            this.#hitsquadRunner.start();
        }

        toggleGamesEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#hitsquadRunner.start() : this.#hitsquadRunner.stop();
            this.#settingsService.setSetting('hitsquadRunner', target.checked);
        });
    }

    #handleQuizCheckbox() {
        // Temporary unavailable
        this.#settingsService.setSetting('quizRunner', false);
        this.#quizRunner.stop();

        // const toggleQuizEl = this.el.querySelector('[data-toggle-quiz]');
        // const isQuizRunning = this.#settingsService.getSetting('quizRunner');
        //
        // toggleQuizEl.checked = isQuizRunning;
        //
        // if (isQuizRunning) {
        //     this.#quizRunner.start();
        // }
        //
        // toggleQuizEl.addEventListener('change', ({ target }) => {
        //     target.checked ? this.#quizRunner.start() : this.#quizRunner.stop();
        //     this.#settingsService.setSetting('quizRunner', target.checked);
        // });
    }

    #handleReloadPage() {
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

    #handleKeydownHandler() {
        // Temporary unavailable
        // window.document.addEventListener('keydown', (event) => {
        //     const command = `!answer${event.key}`;
        //
        //     if (Commands.getAnswers().includes(command)) {
        //         this.#sendMessage(command);
        //     }
        // });
    }

    #handleHitsquadButton() {
        const sendHitsquadButton = this.#el.querySelector('[data-hitsquad]');

        sendHitsquadButton.addEventListener('click', () => {
            this.#sendMessage(Commands.HITSQUAD);
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

    #sendMessage(command) {
        if (!this.#streamStatusService.isBanPhase) {
            this.#twitchChatService.sendMessage(command);
        }
    }
}
