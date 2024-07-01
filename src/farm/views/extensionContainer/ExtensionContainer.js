import './style.css';
import template from './template.html?raw';
import {
    Commands, Timing, GlobalVariables, MessageTemplates
} from '../../consts';
import { BasicView } from '@/farm/views/BasicView';

export class ExtensionContainer extends BasicView {
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
        super(template);

        this.#streamFacade = streamFacade;
        this.#chatFacade = chatFacade;
        this.#miniGamesFacade = miniGamesFacade;
        this.#settingsFacade = settingsFacade;
        this.#twitchFacade = twitchFacade;

        this.#handleStreamStatusCheck();
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
        const toggleGiveawaysEl = this.el.querySelector('[data-toggle-giveaways]');
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
        const toggleGiveawaysEl = this.el.querySelector('[data-toggle-giveaways]');
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
        const toggleGiveawaysEl = this.el.querySelector('[data-toggle-giveaways]');

        toggleGiveawaysEl.checked = false;

        this.#miniGamesFacade.stopHitsquadRunner();

        this.#settingsFacade.updateLocalSettings({
            hitsquadRunner: false,
            hitsquadRunnerRemainingRounds: 0
        });
    }

    #handleHitsquadButton() {
        const sendHitsquadButton = this.el.querySelector('[data-hitsquad]');

        sendHitsquadButton.addEventListener('click', (event) => {
            if (this.#streamFacade.isAllowedToSendMessage || event.ctrlKey) {
                this.#chatFacade.sendMessage(Commands.HITSQUAD, true);
            }
        });
    }

    #initRemoveDelayHandler() {
        setInterval(() => {
            this.#streamFacade.decreaseVideoDelay();
        }, GlobalVariables.DECREASE_DELAY_TIMEOUT);
    }

    #renderStatus() {
        this.el.classList.toggle('broken', this.#streamFacade.isVideoBroken);
        this.el.classList.toggle('anticheat', this.#streamFacade.isAntiCheatScreen);
        this.el.classList.toggle('safe', this.#streamFacade.isAllowedToSendMessage);
    }
}
