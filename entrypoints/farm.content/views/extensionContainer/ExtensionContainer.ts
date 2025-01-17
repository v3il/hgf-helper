import './style.css';
import { SettingsFacade } from '@components/shared/settings';
import { BasicView } from '@components/shared';
import { ChatFacade } from '@farm/modules/chat';
import { MiniGamesFacade } from '@farm/modules/miniGames';
import { StreamFacade } from '@farm/modules/stream';
import { TwitchFacade } from '@farm/modules/twitch';
import {
    Commands, Timing, GlobalVariables, MessageTemplates
} from '@farm/consts';
import { IPageReloader, usePageReloader } from '@farm/views/extensionContainer/usePageReloader';
import template from './template.html?raw';
import { DebugModeView } from '../debugMode';

interface IParams {
    streamFacade: StreamFacade;
    chatFacade: ChatFacade;
    miniGamesFacade: MiniGamesFacade;
    settingsFacade: SettingsFacade;
    twitchFacade: TwitchFacade;
}

export class ExtensionContainer extends BasicView {
    static create({
        streamFacade, chatFacade, miniGamesFacade, settingsFacade, twitchFacade
    }: IParams) {
        return new ExtensionContainer({
            streamFacade,
            chatFacade,
            miniGamesFacade,
            settingsFacade,
            twitchFacade
        });
    }

    private readonly streamFacade: StreamFacade;
    private readonly chatFacade: ChatFacade;
    private readonly miniGamesFacade: MiniGamesFacade;
    private readonly settingsFacade: SettingsFacade;
    private readonly twitchFacade: TwitchFacade;
    private readonly pageReloader: IPageReloader;

    constructor({
        streamFacade, chatFacade, miniGamesFacade, settingsFacade, twitchFacade
    }: IParams) {
        super(template);

        this.streamFacade = streamFacade;
        this.chatFacade = chatFacade;
        this.miniGamesFacade = miniGamesFacade;
        this.settingsFacade = settingsFacade;
        this.twitchFacade = twitchFacade;

        this.pageReloader = usePageReloader();

        this.#addGlobalChatListener();
        this.#handleGiveawaysCheckbox();
        this.#handleHitsquadButton();
        // this.#handleDebugMode();
        this.#handleHitsquadRunnerStop();
        this.handleStreamStatusCheck();
        this.initDebugMode();
        this.initRemoveDelayHandler();
    }

    private initDebugMode() {
        const debugModeView = new DebugModeView(this.twitchFacade);

        window.document.addEventListener('keydown', (event) => {
            // Ctrl + 0
            if (event.ctrlKey && event.key === '0') {
                event.preventDefault();
                debugModeView.toggle();
            }
        });
    }

    private handleStreamStatusCheck() {
        this.streamFacade.checkStreamStatus();
        this.renderStatus();
        this.pageReloader.handleBrokenVideo(this.streamFacade.isVideoBroken);

        const nextCheckDelay = this.getNextCheckDelay();

        setTimeout(() => {
            this.handleStreamStatusCheck();
        }, nextCheckDelay);
    }

    private renderStatus() {
        this.el.classList.toggle('broken', this.streamFacade.isVideoBroken);
        this.el.classList.toggle('anticheat', this.streamFacade.isAntiCheatScreen);
        this.el.classList.toggle('safe', this.streamFacade.isStreamOk);
    }

    getNextCheckDelay() {
        if (this.streamFacade.isAntiCheatScreen) {
            return GlobalVariables.ANTI_CHEAT_DURATION + 10 * Timing.SECOND;
        }

        return 5 * Timing.SECOND;
    }

    #handleGiveawaysCheckbox() {
        const toggleGiveawaysEl = this.el.querySelector<HTMLInputElement>('[data-toggle-giveaways]')!;
        const isHitsquadRunning = this.settingsFacade.getLocalSetting('hitsquadRunner');
        const remainingHitsquadRounds = this.settingsFacade.getLocalSetting('hitsquadRunnerRemainingRounds');

        if (isHitsquadRunning && remainingHitsquadRounds > 0) {
            console.info(`HGF helper: start Hitsquad runner with ${remainingHitsquadRounds} rounds`);
            toggleGiveawaysEl.checked = true;
            this.miniGamesFacade.startHitsquadRunner({ totalRounds: remainingHitsquadRounds });
        }

        toggleGiveawaysEl.addEventListener('change', () => {
            toggleGiveawaysEl.checked ? this.#handleGiveawaysOn() : this.#turnOffGiveaways();
        });
    }

    #handleGiveawaysOn() {
        // eslint-disable-next-line no-alert
        const gamesCount = prompt('Enter games count', `${GlobalVariables.HITSQUAD_GAMES_PER_DAY}`);
        const toggleGiveawaysEl = this.el.querySelector<HTMLInputElement>('[data-toggle-giveaways]')!;
        const numericGamesCount = Number(gamesCount);

        if (!gamesCount || Number.isNaN(numericGamesCount) || numericGamesCount <= 0) {
            toggleGiveawaysEl.checked = false;
            return;
        }

        this.miniGamesFacade.startHitsquadRunner({ totalRounds: numericGamesCount });

        this.settingsFacade.updateLocalSettings({
            hitsquadRunner: true,
            hitsquadRunnerRemainingRounds: numericGamesCount
        });
    }

    #handleHitsquadRunnerStop() {
        this.miniGamesFacade.hitsquadEvents.on('hitsquadRunner:round', ({ remainingRounds, stopped }) => {
            if (stopped) {
                return this.#turnOffGiveaways();
            }

            this.settingsFacade.updateLocalSettings({
                hitsquadRunnerRemainingRounds: remainingRounds
            });
        });
    }

    #addGlobalChatListener() {
        this.chatFacade.observeChat(({ message, isMe, isSystemMessage }) => {
            if (isMe && message.startsWith(Commands.HITSQUAD) && message.split(' ')[1]) {
                return this.#turnOffGiveaways();
            }

            const twitchUserName = this.twitchFacade.twitchUser.userName;

            if (isSystemMessage && MessageTemplates.isTooManyStrikesNotification(message, twitchUserName)) {
                this.#turnOffGiveaways();
            }
        });
    }

    #turnOffGiveaways() {
        const toggleGiveawaysEl = this.el.querySelector<HTMLInputElement>('[data-toggle-giveaways]')!;

        toggleGiveawaysEl.checked = false;

        this.miniGamesFacade.stopHitsquadRunner();

        this.settingsFacade.updateLocalSettings({
            hitsquadRunner: false,
            hitsquadRunnerRemainingRounds: 0
        });
    }

    #handleHitsquadButton() {
        const sendHitsquadButton = this.el.querySelector<HTMLButtonElement>('[data-hitsquad]')!;

        sendHitsquadButton.addEventListener('click', (event) => {
            if (this.streamFacade.isStreamOk || event.ctrlKey) {
                this.chatFacade.sendMessage(Commands.HITSQUAD, event.ctrlKey);
            }
        });
    }

    initRemoveDelayHandler() {
        setInterval(() => {
            this.streamFacade.decreaseVideoDelay();
        }, GlobalVariables.DECREASE_DELAY_TIMEOUT);
    }
}
