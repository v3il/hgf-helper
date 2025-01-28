import { Commands, MessageTemplates, Timing } from '@farm/consts';
import { ChatFacade } from '@farm/modules/chat';
import { TwitchFacade } from '@farm/modules/twitch';
import { MiniGamesFacade } from '@farm/modules/miniGames';
import { StreamFacade } from '@farm/modules/stream';

interface IParams {
    el: HTMLElement;
    chatFacade: ChatFacade,
    twitchFacade: TwitchFacade,
    miniGamesFacade: MiniGamesFacade,
    streamFacade: StreamFacade
}

const HITSQUAD_GAMES_PER_DAY = 600;

export const useHitsquadRunner = ({
    el, chatFacade, twitchFacade, miniGamesFacade, streamFacade
}: IParams) => {
    const checkboxEl = el.querySelector<HTMLInputElement>('[data-toggle-hitsquad]')!;
    const buttonEl = el.querySelector<HTMLButtonElement>('[data-hitsquad-button]')!;
    const timerEl = el.querySelector<HTMLButtonElement>('[data-hitsquad-time]')!;

    let intervalId: number;

    checkboxEl.checked = miniGamesFacade.isHitsquadRunning;

    if (miniGamesFacade.isHitsquadRunning) {
        setupTimer();
    }

    checkboxEl.addEventListener('change', () => {
        checkboxEl.checked ? turnHitsquadOn() : turnHitsquadOff();
    });

    miniGamesFacade.hitsquadEvents.on('end', () => {
        checkboxEl.checked = false;
    });

    chatFacade.observeChat(({ message, isMe, isSystemMessage }) => {
        const twitchUserName = twitchFacade.twitchUser.userName;
        const isStopCommand = isMe && message.startsWith(Commands.HITSQUAD) && message.split(' ')[1];
        const isStrike = isSystemMessage && MessageTemplates.isTooManyStrikesNotification(message, twitchUserName);

        if (isStopCommand || isStrike) {
            turnHitsquadOff();
        }
    });

    buttonEl.addEventListener('click', (event) => {
        if (event.ctrlKey) {
            chatFacade.withoutSuppression(() => miniGamesFacade.participateHitsquadOnce());
        } else if (streamFacade.isStreamOk) {
            miniGamesFacade.participateHitsquadOnce();
        }
    });

    function turnHitsquadOn() {
        const gamesCount = prompt('Enter rounds count', `${HITSQUAD_GAMES_PER_DAY}`);
        const numericGamesCount = Number(gamesCount);

        if (!gamesCount || Number.isNaN(numericGamesCount) || numericGamesCount <= 0) {
            return turnHitsquadOff();
        }

        miniGamesFacade.startHitsquadRunner(numericGamesCount);

        setupTimer();
    }

    function turnHitsquadOff() {
        miniGamesFacade.stopHitsquadRunner();
        checkboxEl.checked = false;
        clearInterval(intervalId);
        timerEl.classList.add('hidden');
    }

    function setupTimer() {
        timerTick();
        intervalId = window.setInterval(timerTick, Timing.SECOND);
    }

    function timerTick() {
        const time = miniGamesFacade.timeUntilHitsquadMessage;
        const diff = time - Date.now();
        const minutes = Math.floor(diff / Timing.MINUTE).toString().padStart(2, '0');
        const seconds = Math.floor((diff % Timing.MINUTE) / Timing.SECOND).toString().padStart(2, '0');

        timerEl.textContent = `(${minutes}:${seconds})`;
        timerEl.classList.toggle('hidden', time <= 0);

        if (time <= 0) {
            clearInterval(intervalId);
        }
    }
};
