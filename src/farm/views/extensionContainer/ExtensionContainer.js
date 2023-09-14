import './style.css';
import { Container } from 'typedi';
import template from './template.html?raw';
import {
    Commands, InjectionTokens, Timing, isDev
} from '../../consts';
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
        this.#toggleStatusClass();
    }

    #listenEvents() {
        this.#handleQuizCheckbox();
        this.#handleMiniGamesCheckbox();
        this.#handleCheckEvent();
        this.#handleKeydownHandler();
        this.#handleHitsquadButton();
        this.#handleDebugMode();
    }

    #handleDebugMode() {
        window.document.addEventListener('keydown', (event) => {
            // Ctrl + 0
            if (event.ctrlKey && event.key === '0') {
                event.preventDefault();
                this.#streamStatusService.renderVideoFrame();
                this.#canvasView.toggleDebug();
            }
        });
    }

    #handleMiniGamesCheckbox() {
        const toggleGamesEl = this.el.querySelector('[data-toggle-giveaways]');
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
        const toggleQuizEl = this.el.querySelector('[data-toggle-trivia]');
        const isQuizRunning = this.#settingsService.getSetting('quizRunner');

        toggleQuizEl.checked = isQuizRunning;

        if (isQuizRunning) {
            this.#quizRunner.start();
        }

        toggleQuizEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#quizRunner.start() : this.#quizRunner.stop();
            this.#settingsService.setSetting('quizRunner', target.checked);
        });
    }

    #handleCheckEvent() {
        this.#streamStatusService.events.on('check', () => {
            this.#toggleStatusClass();
        });
    }

    #handleKeydownHandler() {
        window.document.addEventListener('keydown', (event) => {
            const command = `!answer${event.key}`;

            if (Commands.getAnswers().includes(command)) {
                this.#twitchChatService.sendMessage(command);
            }
        });
    }

    #handleHitsquadButton() {
        const sendHitsquadButton = this.#el.querySelector('[data-hitsquad]');

        sendHitsquadButton.addEventListener('click', (event) => {
            if (!this.#streamStatusService.isBanPhase) {
                this.#twitchChatService.sendMessage(Commands.HITSQUAD, event.ctrlKey);
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
        this.el.classList.toggle('haf-extension-container--ban-phase', this.#streamStatusService.isBanPhase);
        this.el.classList.toggle('haf-extension-container--no-ban-phase', !this.#streamStatusService.isBanPhase);
    }

    #createElement() {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild;
    }
}
