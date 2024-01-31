import './style.css';
import template from './template.html?raw';
import { Commands, Timing, GlobalVariables } from '../../consts';
import { StreamFacade } from '../../modules/stream';
import { ChatFacade } from '../../modules/chat';
import { MiniGamesFacade } from '../../modules/miniGames';
import { SettingsFacade } from '../../modules/settings';

export class ExtensionContainer {
    static create() {
        return new ExtensionContainer({
            streamFacade: StreamFacade.instance,
            chatFacade: ChatFacade.instance,
            miniGamesFacade: MiniGamesFacade.instance,
            settingsFacade: SettingsFacade.instance
        });
    }

    #el;
    #timeoutId;

    #streamFacade;
    #chatFacade;
    #miniGamesFacade;
    #settingsFacade;

    #isDebug = false;
    #brokenVideoRoundsCount = 0;

    constructor({
        streamFacade, chatFacade, miniGamesFacade, settingsFacade
    }) {
        this.#streamFacade = streamFacade;
        this.#chatFacade = chatFacade;
        this.#miniGamesFacade = miniGamesFacade;
        this.#settingsFacade = settingsFacade;

        this.#el = this.#createElement();

        this.#handleStreamStatusCheck();
        // this.#handleTriviaCheckbox();
        // this.#handleTriviaAnswersHandler();
        this.#handleGiveawaysCheckbox();
        this.#handleGiveawaysRemoteControl();
        this.#handleHitsquadButton();
        this.#handleDebugMode();
        this.#initRemoveDelayHandler();
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
        const isHitsquadRunning = this.#settingsFacade.getLocalSetting('hitsquadRunner');

        toggleGamesEl.checked = isHitsquadRunning;

        if (isHitsquadRunning) {
            this.#miniGamesFacade.startHitsquadRunner();
        }

        toggleGamesEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#miniGamesFacade.startHitsquadRunner() : this.#miniGamesFacade.stopHitsquadRunner();
            this.#settingsFacade.updateLocalSettings({ hitsquadRunner: target.checked });
        });
    }

    #handleGiveawaysRemoteControl() {
        const toggleGiveawaysEl = this.#el.querySelector('[data-toggle-giveaways]');

        this.#chatFacade.observeChat(({ message, isMe }) => {
            const isHitsquadCommand = message.startsWith(Commands.HITSQUAD);

            if (!(isMe && isHitsquadCommand)) {
                return;
            }

            const commandSuffix = message.split(' ')[1];

            if (commandSuffix) {
                this.#miniGamesFacade.stopHitsquadRunner();
                this.#settingsFacade.updateLocalSettings({ hitsquadRunner: false });
                toggleGiveawaysEl.checked = false;
            }
        });
    }

    #handleTriviaCheckbox() {
        const toggleTriviaEl = this.#el.querySelector('[data-toggle-trivia]');
        const isTriviaRunning = this.#settingsFacade.getLocalSetting('quizRunner');

        toggleTriviaEl.checked = isTriviaRunning;

        if (isTriviaRunning) {
            this.#miniGamesFacade.startTriviaRunner();
        }

        toggleTriviaEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#miniGamesFacade.startTriviaRunner() : this.#miniGamesFacade.stopTriviaRunner();
            this.#settingsFacade.updateLocalSettings({ quizRunner: target.checked });
        });
    }

    #handleTriviaAnswersHandler() {
        window.document.addEventListener('keydown', (event) => {
            const command = `!answer${event.key}`;

            if (Commands.getAnswers().includes(command)) {
                this.#chatFacade.sendMessage(command);
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
            this.#streamFacade.decreaseVideoDelay();
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
