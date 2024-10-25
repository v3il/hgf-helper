import './style.css';
import template from './template.html?raw';
import {
    Commands, Timing, GlobalVariables, MessageTemplates
} from '../../consts';

export class ExtensionContainer {
    static create({
        streamFacade, chatFacade, miniGamesFacade, settingsFacade, twitchFacade
    }) {
        return new ExtensionContainer({
            streamFacade,
            chatFacade,
            miniGamesFacade,
            settingsFacade,
            twitchFacade
        });
    }

    #el;
    #timeoutId;

    #streamFacade;
    #chatFacade;
    #miniGamesFacade;
    #settingsFacade;
    #twitchFacade;

    #isDebug = false;
    #brokenVideoRoundsCount = 0;

    constructor({
        streamFacade, chatFacade, miniGamesFacade, settingsFacade, twitchFacade
    }) {
        this.#streamFacade = streamFacade;
        this.#chatFacade = chatFacade;
        this.#miniGamesFacade = miniGamesFacade;
        this.#settingsFacade = settingsFacade;
        this.#twitchFacade = twitchFacade;

        this.#el = this.#createElement();

        this.#handleStreamStatusCheck();
        // this.#handleTriviaCheckbox();
        // this.#handleTriviaAnswersHandler();
        this.#addGlobalChatListener();
        this.#handleGiveawaysCheckbox();
        this.#handleHitsquadButton();
        this.#handleDebugMode();
        this.#initRemoveDelayHandler();
        this.#handleHitsquadRunnerStop();
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
        const toggleGiveawaysEl = this.#el.querySelector('[data-toggle-giveaways]');
        const isHitsquadRunning = this.#settingsFacade.getLocalSetting('hitsquadRunner');
        const remainingHitsquadRounds = this.#settingsFacade.getLocalSetting('hitsquadRunnerRemainingRounds');

        if (isHitsquadRunning && remainingHitsquadRounds > 0) {
            console.info(`HGF helper: start Hitsquad runner with ${remainingHitsquadRounds} rounds`);
            toggleGiveawaysEl.checked = true;
            this.#miniGamesFacade.startHitsquadRunner({ totalRounds: remainingHitsquadRounds });
        }

        toggleGiveawaysEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#handleGiveawaysOn() : this.#turnOffGiveaways();
        });
    }

    #handleGiveawaysOn() {
        // eslint-disable-next-line no-alert
        const gamesCount = prompt('Enter games count', `${GlobalVariables.HITSQUAD_GAMES_PER_DAY}`);
        const toggleGiveawaysEl = this.#el.querySelector('[data-toggle-giveaways]');
        const numericGamesCount = Number(gamesCount);

        if (!gamesCount || Number.isNaN(numericGamesCount) || numericGamesCount <= 0) {
            toggleGiveawaysEl.checked = false;
            return;
        }

        this.#miniGamesFacade.startHitsquadRunner({ totalRounds: numericGamesCount });

        this.#settingsFacade.updateLocalSettings({
            hitsquadRunner: true,
            hitsquadRunnerRemainingRounds: numericGamesCount
        });
    }

    #handleHitsquadRunnerStop() {
        this.#miniGamesFacade.onHitsquadRoundEnd(({ remainingRounds, stopped }) => {
            if (stopped) {
                return this.#turnOffGiveaways();
            }

            this.#settingsFacade.updateLocalSettings({
                hitsquadRunnerRemainingRounds: remainingRounds
            });
        });
    }

    #addGlobalChatListener() {
        this.#chatFacade.observeChat(({ message, isMe, isSystemMessage }) => {
            if (isMe && message.startsWith(Commands.HITSQUAD) && message.split(' ')[1]) {
                return this.#turnOffGiveaways();
            }

            const twitchUserName = this.#twitchFacade.twitchUser.userName;

            if (isSystemMessage && MessageTemplates.isTooManyStrikesNotification(message, twitchUserName)) {
                this.#turnOffGiveaways();
            }
        });
    }

    #turnOffGiveaways() {
        const toggleGiveawaysEl = this.#el.querySelector('[data-toggle-giveaways]');

        toggleGiveawaysEl.checked = false;

        this.#miniGamesFacade.stopHitsquadRunner();

        this.#settingsFacade.updateLocalSettings({
            hitsquadRunner: false,
            hitsquadRunnerRemainingRounds: 0
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
