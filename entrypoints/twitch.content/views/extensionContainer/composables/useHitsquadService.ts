import { Timing } from '@shared/consts';
import { HitsquadGameService } from '@twitch/modules/miniGames';

interface IParams {
    el: HTMLElement;
}

export interface IHitsquadService {
    destroy: () => void;
}

const HITSQUAD_GAMES_PER_DAY = 600;

export const useHitsquadService = ({ el }: IParams): IHitsquadService => {
    const gameService = new HitsquadGameService();

    const checkboxEl = el.querySelector<HTMLInputElement>('[data-toggle-hitsquad]')!;
    const buttonEl = el.querySelector<HTMLButtonElement>('[data-hitsquad-button]')!;
    const timerEl = el.querySelector<HTMLButtonElement>('[data-hitsquad-time]')!;
    const counterEl = el.querySelector<HTMLButtonElement>('[data-hitsquad-counter]')!;

    let intervalId: number;
    let unsubscribeCounter: () => void;

    checkboxEl.checked = gameService.isRunning;

    if (gameService.isRunning) {
        setupTimer();
        setupCounter();
    }

    const checkboxChangeHandler = () => {
        checkboxEl.checked ? turnHitsquadOn() : turnHitsquadOff();
    };

    const buttonClickHandler = () => {
        gameService.participate();
    };

    checkboxEl.addEventListener('change', checkboxChangeHandler);
    buttonEl.addEventListener('click', buttonClickHandler);

    const unsubscribeEndEvent = gameService.events.on('end', turnHitsquadOff);

    function turnHitsquadOn() {
        const gamesCount = prompt('Enter rounds count', `${HITSQUAD_GAMES_PER_DAY}`);
        const numericGamesCount = Number(gamesCount);

        if (!gamesCount || Number.isNaN(numericGamesCount) || numericGamesCount <= 0) {
            return turnHitsquadOff();
        }

        gameService.start(numericGamesCount);

        setupTimer();
        setupCounter();
    }

    function turnHitsquadOff() {
        gameService.stop();
        checkboxEl.checked = false;

        clearInterval(intervalId);
        timerEl.classList.add('hidden');

        unsubscribeCounter?.();
        counterEl.classList.add('hidden');
    }

    function setupTimer() {
        timerTick();
        intervalId = window.setInterval(timerTick, Timing.SECOND);
        timerEl.classList.remove('hidden');
    }

    function timerTick() {
        const time = gameService.timeUntilMessage;
        const diff = time - Date.now();
        const minutes = Math.floor(diff / Timing.MINUTE).toString().padStart(2, '0');
        const seconds = Math.floor((diff % Timing.MINUTE) / Timing.SECOND).toString().padStart(2, '0');

        timerEl.textContent = `(${minutes}:${seconds})`;
    }

    function setupCounter() {
        renderCounter();
        unsubscribeCounter = gameService.events.on('round', renderCounter);
        counterEl.classList.remove('hidden');
    }

    function renderCounter() {
        const { roundsData } = gameService;

        counterEl.textContent = `[${roundsData.left}/${roundsData.total}]`;
    }

    return {
        destroy: () => {
            gameService.stop();
            clearInterval(intervalId);
            unsubscribeCounter?.();
            unsubscribeEndEvent();

            gameService.events.off('end', turnHitsquadOff);
            checkboxEl.removeEventListener('change', checkboxChangeHandler);
            buttonEl.removeEventListener('click', buttonClickHandler);
        }
    };
};
