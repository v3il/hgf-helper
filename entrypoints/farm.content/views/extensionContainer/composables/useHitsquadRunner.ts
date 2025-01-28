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
    const counterEl = el.querySelector<HTMLButtonElement>('[data-hitsquad-counter]')!;

    let intervalId: number;
    let unsubscribeCounter: () => void;

    checkboxEl.checked = miniGamesFacade.isHitsquadRunning;

    if (miniGamesFacade.isHitsquadRunning) {
        setupTimer();
        setupCounter();
    }

    checkboxEl.addEventListener('change', () => {
        checkboxEl.checked ? turnHitsquadOn() : turnHitsquadOff();
    });

    miniGamesFacade.hitsquadEvents.on('end', () => {
        console.error(22);
        turnHitsquadOff();
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
        setupCounter();
    }

    function turnHitsquadOff() {
        miniGamesFacade.stopHitsquadRunner();
        checkboxEl.checked = false;

        clearInterval(intervalId);
        timerEl.classList.add('hidden');

        counterEl.classList.add('hidden');
        unsubscribeCounter?.();
    }

    function setupTimer() {
        timerTick();
        intervalId = window.setInterval(timerTick, Timing.SECOND);
        timerEl.classList.remove('hidden');
    }

    function timerTick() {
        const time = miniGamesFacade.timeUntilHitsquadMessage;
        const diff = time - Date.now();
        const minutes = Math.floor(diff / Timing.MINUTE).toString().padStart(2, '0');
        const seconds = Math.floor((diff % Timing.MINUTE) / Timing.SECOND).toString().padStart(2, '0');

        timerEl.textContent = `(${minutes}:${seconds})`;
    }

    function setupCounter() {
        renderCounter();
        unsubscribeCounter = miniGamesFacade.hitsquadEvents.on('round', renderCounter);
        counterEl.classList.remove('hidden');
    }

    function renderCounter() {
        const roundsData = miniGamesFacade.hitsquadRoundsData;

        counterEl.textContent = `[${roundsData.left}/${roundsData.total}]`;
    }
};
