import './style.css';
import { Container } from 'typedi';
import template from './template.html?raw';
import { Commands, InjectionTokens, Timing } from '../../consts';

export class ExtensionContainer {
    static #ANTI_CHEAT_DURATION = 2 * Timing.MINUTE + 10 * Timing.SECOND;
    static #CHECK_INTERVAL = 3 * Timing.SECOND;

    static create() {
        const hitsquadRunner = Container.get(InjectionTokens.HITSQUAD_RUNNER);
        const quizRunner = Container.get(InjectionTokens.QUIZ_RUNNER);
        const twitchChatService = Container.get(InjectionTokens.CHAT_SERVICE);
        const streamStatusService = Container.get(InjectionTokens.STREAM_STATUS_SERVICE);
        const settingsService = Container.get(InjectionTokens.SETTINGS_SERVICE);
        const canvasView = Container.get(InjectionTokens.STREAM_STATUS_CANVAS);
        const chatObserver = Container.get(InjectionTokens.CHAT_OBSERVER);
        const twitchElementsRegistry = Container.get(InjectionTokens.ELEMENTS_REGISTRY);
        const debugModeView = Container.get(InjectionTokens.DEBUG_MODE_VIEW);

        return new ExtensionContainer({
            hitsquadRunner,
            streamStatusService,
            twitchChatService,
            settingsService,
            quizRunner,
            canvasView,
            chatObserver,
            twitchElementsRegistry,
            debugModeView
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
    #timeoutId;
    #debugModeView;
    #isDebug = false;

    constructor({
        streamStatusService,
        twitchChatService,
        hitsquadRunner,
        settingsService,
        quizRunner,
        canvasView,
        chatObserver,
        twitchElementsRegistry,
        debugModeView
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
        this.#debugModeView = debugModeView;

        this.#handleStreamStatusCheck();
        this.#listenEvents();
    }

    #handleStreamStatusCheck() {
        this.#checkStreamStatus();

        const time = this.#streamStatusService.isAntiCheatScreen
            ? ExtensionContainer.#ANTI_CHEAT_DURATION
            : ExtensionContainer.#CHECK_INTERVAL;

        console.error(time);

        this.#timeoutId = setTimeout(() => {
            this.#handleStreamStatusCheck();
        }, time);
    }

    #checkStreamStatus() {
        const videoEl = this.#twitchElementsRegistry.activeVideoEl;

        this.#streamStatusService.checkStreamStatus(videoEl);
        this.#renderStatus();
    }

    #listenEvents() {
        // this.#handleTriviaCheckbox();
        // this.#handleTriviaAnswersHandler();
        this.#handleGiveawaysCheckbox();
        this.#handleGiveawaysRemoteControl();
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

        this.#debugModeView.renderVideoFrame(videoEl);
        this.#debugModeView.enterDebugMode();
    }

    #exitDebugMode() {
        this.#debugModeView.exitDebugMode();
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
                this.#settingsService.updateSettings({ hitsquadRunner: isEnabled });
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

    #handleTriviaAnswersHandler() {
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
            if (this.#streamStatusService.isAllowedToSendMessage || event.ctrlKey) {
                this.#twitchChatService.sendMessage(Commands.HITSQUAD, event.ctrlKey);
            }
        });
    }

    mount(rootEl) {
        rootEl.appendChild(this.#el);
    }

    #renderStatus() {
        this.#el.classList.toggle('broken', this.#streamStatusService.isVideoBroken);
        this.#el.classList.toggle('anticheat', this.#streamStatusService.isAntiCheatScreen);
        this.#el.classList.toggle('safe', this.#streamStatusService.isAllowedToSendMessage);
    }

    #createElement() {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild;
    }
}
