import './style.css';
import { Container } from 'typedi';
import template from './template.html?raw';
import {
    Commands, InjectionTokens, StreamStatuses, Timing
} from '../../consts';

export class ExtensionContainer {
    static create() {
        const hitsquadRunner = Container.get(InjectionTokens.HITSQUAD_RUNNER);
        const quizRunner = Container.get(InjectionTokens.QUIZ_RUNNER);
        const twitchChatService = Container.get(InjectionTokens.CHAT_SERVICE);
        const streamStatusService = Container.get(InjectionTokens.STREAM_STATUS_SERVICE);
        const settingsService = Container.get(InjectionTokens.SETTINGS_SERVICE);
        const canvasView = Container.get(InjectionTokens.CANVAS_VIEW);
        const chatObserver = Container.get(InjectionTokens.CHAT_OBSERVER);
        const twitchElementsRegistry = Container.get(InjectionTokens.ELEMENTS_REGISTRY);

        return new ExtensionContainer({
            hitsquadRunner,
            streamStatusService,
            twitchChatService,
            settingsService,
            quizRunner,
            canvasView,
            chatObserver,
            twitchElementsRegistry
        });
    }

    #el;
    #streamStatusService;
    #twitchChatService;
    #hitsquadRunner;
    #settingsService;
    #quizRunner;
    #canvasView;
    #chatObserver;
    #twitchElementsRegistry;
    #intervalId;
    #isDebug = false;

    constructor({
        streamStatusService,
        twitchChatService,
        hitsquadRunner,
        settingsService,
        quizRunner,
        canvasView,
        chatObserver,
        twitchElementsRegistry
    }) {
        this.#el = this.#createElement();
        this.#streamStatusService = streamStatusService;
        this.#twitchChatService = twitchChatService;
        this.#hitsquadRunner = hitsquadRunner;
        this.#settingsService = settingsService;
        this.#quizRunner = quizRunner;
        this.#canvasView = canvasView;
        this.#chatObserver = chatObserver;
        this.#twitchElementsRegistry = twitchElementsRegistry;

        this.#checkStreamStatus(1);
        this.#handleStreamStatusCheck();
        this.#listenEvents();
    }

    #handleStreamStatusCheck() {
        this.#intervalId = setInterval(() => {
            this.#checkStreamStatus(3);
        }, 20 * Timing.SECOND);
    }

    async #checkStreamStatus(checksCount) {
        const videoEl = this.#twitchElementsRegistry.activeVideoEl;

        if (!videoEl || videoEl.paused || videoEl.ended) {
            this.#streamStatusService.forceBanPhase();
            this.#toggleStatus(StreamStatuses.ANTICHEAT);
            return;
        }

        this.#toggleStatus(StreamStatuses.CHECKING);
        this.#canvasView.renderVideoFrame(videoEl);
        await this.#streamStatusService.checkStreamStatus(checksCount);
        this.#toggleStatus(this.#streamStatusService.isBanPhase ? StreamStatuses.ANTICHEAT : StreamStatuses.NORMAL);
    }

    #listenEvents() {
        this.#handleTriviaCheckbox();
        this.#handleGiveawaysCheckbox();
        this.#handleGiveawaysRemoteControl();
        this.#handleKeydownHandler();
        this.#handleHitsquadButton();
        this.#handleDebugMode();
    }

    #handleDebugMode() {
        window.document.addEventListener('keydown', (event) => {
            // Ctrl + 0
            if (event.ctrlKey && event.key === '0') {
                event.preventDefault();

                this.#isDebug = !this.#isDebug;
                this.#isDebug ? this.#enterDebugMode() : this.#exitDebugMode();
            }
        });
    }

    #enterDebugMode() {
        const videoEl = this.#twitchElementsRegistry.activeVideoEl;

        clearInterval(this.#intervalId);
        this.#toggleStatus(StreamStatuses.DEBUG);
        this.#streamStatusService.forceBanPhase();
        this.#canvasView.renderVideoFrame(videoEl);
        this.#canvasView.enterDebugMode();
    }

    #exitDebugMode() {
        this.#canvasView.exitDebugMode();
        this.#checkStreamStatus(1);
        this.#handleStreamStatusCheck();
    }

    #handleGiveawaysCheckbox() {
        const toggleGamesEl = this.#el.querySelector('[data-toggle-giveaways]');
        const isHitsquadRunning = this.#settingsService.getSetting('hitsquadRunner');

        toggleGamesEl.checked = isHitsquadRunning;

        if (isHitsquadRunning) {
            this.#hitsquadRunner.start();
        }

        toggleGamesEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#hitsquadRunner.start() : this.#hitsquadRunner.stop();
            this.#settingsService.updateSettings({ hitsquadRunner: target.checked });
        });
    }

    #handleGiveawaysRemoteControl() {
        const toggleGamesEl = this.#el.querySelector('[data-toggle-giveaways]');

        this.#chatObserver.events.on('message', ({ message, isMe }) => {
            const isHitsquadCommand = message.startsWith(Commands.HITSQUAD);

            if (!(isMe && isHitsquadCommand)) {
                return;
            }

            const commandSuffix = message.split(' ')[1];

            if (commandSuffix) {
                const isEnabled = commandSuffix.length % 2 === 0;

                isEnabled ? this.#hitsquadRunner.start() : this.#hitsquadRunner.stop();
                this.#settingsService.setSetting('hitsquadRunner', isEnabled);
                toggleGamesEl.checked = isEnabled;
            }
        });
    }

    #handleTriviaCheckbox() {
        const toggleQuizEl = this.#el.querySelector('[data-toggle-trivia]');
        const isQuizRunning = this.#settingsService.getSetting('quizRunner');

        toggleQuizEl.checked = isQuizRunning;

        if (isQuizRunning) {
            this.#quizRunner.start();
        }

        toggleQuizEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#quizRunner.start() : this.#quizRunner.stop();
            this.#settingsService.updateSettings({ quizRunner: target.checked });
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
            if (!this.#streamStatusService.isBanPhase || event.ctrlKey) {
                this.#twitchChatService.sendMessage(Commands.HITSQUAD, event.ctrlKey);
            }
        });
    }

    mount(rootEl) {
        rootEl.appendChild(this.#el);
    }

    #toggleStatus(status) {
        this.#el.classList.toggle('haf-extension-container--debug', status === StreamStatuses.DEBUG);
        this.#el.classList.toggle('haf-extension-container--checks-running', status === StreamStatuses.CHECKING);
        this.#el.classList.toggle('haf-extension-container--ban-phase', status === StreamStatuses.ANTICHEAT);
        this.#el.classList.toggle('haf-extension-container--no-ban-phase', status === StreamStatuses.NORMAL);
    }

    #createElement() {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild;
    }
}
