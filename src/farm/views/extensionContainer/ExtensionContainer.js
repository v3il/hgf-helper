import './style.css';
import { Container } from 'typedi';
import template from './template.html?raw';
import {
    Commands, InjectionTokens, Timing, GlobalVariables
} from '../../consts';
import { StreamFacade } from '../../modules/stream';
import { ChatFacade } from '../../modules/chat';

export class ExtensionContainer {
    static create() {
        // const hitsquadRunner = Container.get(InjectionTokens.HITSQUAD_RUNNER);
        // const quizRunner = Container.get(InjectionTokens.QUIZ_RUNNER);
        // const twitchChatService = Container.get(InjectionTokens.CHAT_SERVICE);
        // const streamStatusService = Container.get(InjectionTokens.STREAM_STATUS_SERVICE);
        // const canvasView = Container.get(InjectionTokens.STREAM_STATUS_CANVAS);
        // const chatObserver = Container.get(InjectionTokens.CHAT_OBSERVER);
        // const twitchElementsRegistry = Container.get(InjectionTokens.ELEMENTS_REGISTRY);
        // const debugModeView = Container.get(InjectionTokens.DEBUG_MODE_VIEW);
        // const twitchPlayerService = Container.get(InjectionTokens.PLAYER_SERVICE);

        return new ExtensionContainer({
            // hitsquadRunner,
            // streamStatusService,
            // twitchChatService,
            // quizRunner,
            // canvasView,
            // chatObserver,
            // twitchElementsRegistry,
            // debugModeView,
            // twitchPlayerService,

            streamFacade: StreamFacade.instance,
            chatFacade: ChatFacade.instance
        });
    }

    #el;
    #streamStatusService;
    #twitchChatService;
    #hitsquadRunner;
    #quizRunner;
    #canvasView;
    #chatObserver;
    #twitchElementsRegistry;
    #timeoutId;
    #debugModeView;
    #twitchPlayerService;

    #streamFacade;
    #chatFacade;

    #isDebug = false;
    #brokenVideoRoundsCount = 0;

    constructor({
        streamStatusService,
        twitchChatService,
        hitsquadRunner,
        quizRunner,
        canvasView,
        chatObserver,
        twitchElementsRegistry,
        debugModeView,
        twitchPlayerService,
        streamFacade,
        chatFacade
    }) {
        this.#streamFacade = streamFacade;
        this.#chatFacade = chatFacade;

        this.#el = this.#createElement();
        // this.#streamStatusService = streamStatusService;
        // this.#twitchChatService = twitchChatService;
        // this.#hitsquadRunner = hitsquadRunner;
        // this.#quizRunner = quizRunner;
        // this.#canvasView = canvasView;
        // this.#chatObserver = chatObserver;
        // this.#twitchElementsRegistry = twitchElementsRegistry;
        // this.#debugModeView = debugModeView;
        // this.#twitchPlayerService = twitchPlayerService;
        //
        // this.#settingsFacade = settingsFacade;

        this.#handleStreamStatusCheck();
        // this.#handleTriviaCheckbox();
        // this.#handleTriviaAnswersHandler();
        // this.#handleGiveawaysCheckbox();
        // this.#handleGiveawaysRemoteControl();
        this.#handleHitsquadButton();
        this.#handleDebugMode();
        // this.#initRemoveDelayHandler();
    }

    #handleStreamStatusCheck() {
        this.#checkStreamStatus();

        if (this.#streamFacade.isVideoBroken) {
            this.#brokenVideoRoundsCount++;

            if (this.#brokenVideoRoundsCount >= GlobalVariables.PAGE_RELOAD_ROUNDS) {
                return window.location.reload();
            }
        } else {
            this.#brokenVideoRoundsCount = 0;
        }

        const nextCheckDelay = this.#getNextCheckDelay();

        this.#timeoutId = setTimeout(() => {
            this.#handleStreamStatusCheck();
        }, nextCheckDelay);
    }

    #getNextCheckDelay() {
        if (this.#streamFacade.isAntiCheatScreen) {
            return GlobalVariables.ANTI_CHEAT_DURATION + 10 * Timing.SECOND;
        }

        return 5 * Timing.SECOND;
    }

    #checkStreamStatus() {
        this.#streamFacade.checkStreamStatus();
        this.#renderStatus();
    }

    #handleDebugMode() {
        window.document.addEventListener('keydown', (event) => {
            // Ctrl + 0
            if (event.ctrlKey && event.key === '0') {
                event.preventDefault();

                this.#isDebug = !this.#isDebug;

                if (this.#isDebug) {
                    this.#streamFacade.enterDebugMode();
                } else {
                    this.#streamFacade.exitDebugMode();
                }
            }
        });
    }

    #handleGiveawaysCheckbox() {
        const toggleGamesEl = this.#el.querySelector('[data-toggle-giveaways]');
        const isHitsquadRunning = false; // this.#settingsFacade.getLocalSetting('hitsquadRunner');

        toggleGamesEl.checked = isHitsquadRunning;

        if (isHitsquadRunning) {
            this.#hitsquadRunner.start();
        }

        toggleGamesEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#hitsquadRunner.start() : this.#hitsquadRunner.stop();
            // this.#settingsFacade.updateLocalSettings({ hitsquadRunner: target.checked });
        });
    }

    #handleGiveawaysRemoteControl() {
        const toggleGiveawaysEl = this.#el.querySelector('[data-toggle-giveaways]');

        this.#chatObserver.events.on('message', ({ message, isMe }) => {
            const isHitsquadCommand = message.startsWith(Commands.HITSQUAD);

            if (!(isMe && isHitsquadCommand)) {
                return;
            }

            const commandSuffix = message.split(' ')[1];

            if (commandSuffix) {
                this.#hitsquadRunner.stop();
                // this.#settingsFacade.updateLocalSettings({ hitsquadRunner: false });
                toggleGiveawaysEl.checked = false;
            }
        });
    }

    #handleTriviaCheckbox() {
        const toggleQuizEl = this.#el.querySelector('[data-toggle-trivia]');
        const isQuizRunning = false; // this.#settingsFacade.getLocalSetting('quizRunner');

        toggleQuizEl.checked = isQuizRunning;

        if (isQuizRunning) {
            this.#quizRunner.start();
        }

        toggleQuizEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#quizRunner.start() : this.#quizRunner.stop();
            // this.#settingsFacade.updateLocalSettings({ quizRunner: target.checked });
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
            if (this.#streamFacade.isAllowedToSendMessage || event.ctrlKey) {
                this.#chatFacade.sendMessage(Commands.HITSQUAD, event.ctrlKey);
            }
        });
    }

    #initRemoveDelayHandler() {
        setInterval(() => {
            this.#twitchPlayerService.decreaseVideoDelay();
        }, GlobalVariables.DECREASE_DELAY_TIMEOUT);
    }

    mount(rootEl) {
        rootEl.appendChild(this.#el);
    }

    #renderStatus() {
        this.#el.classList.toggle('broken', this.#streamFacade.isVideoBroken);
        this.#el.classList.toggle('anticheat', this.#streamFacade.isAntiCheatScreen);
        this.#el.classList.toggle('safe', this.#streamFacade.isAllowedToSendMessage);
    }

    #createElement() {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild;
    }
}
