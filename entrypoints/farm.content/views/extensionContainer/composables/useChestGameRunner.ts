import { MiniGamesFacade } from '@farm/modules/miniGames';
import { Timing } from '@farm/consts';

interface IParams {
    el: HTMLElement;
    miniGamesFacade: MiniGamesFacade
}

export const useChestGameRunner = ({ el, miniGamesFacade }: IParams) => {
    const checkboxEl = el.querySelector<HTMLInputElement>('[data-toggle-chest-game]')!;
    const buttonEl = el.querySelector<HTMLInputElement>('[data-chest-game-button]')!;
    const timerEl = el.querySelector<HTMLButtonElement>('[data-chest-time]')!;

    let intervalId: number;

    checkboxEl.checked = miniGamesFacade.isChestGameRunning;

    if (miniGamesFacade.isChestGameRunning) {
        setupTimer();
    }

    checkboxEl.addEventListener('change', () => {
        if (checkboxEl.checked) {
            miniGamesFacade.startChestRunner();
            return setupTimer();
        }

        miniGamesFacade.stopChestRunner();
        clearInterval(intervalId);
        timerEl.classList.add('hidden');
    });

    buttonEl.addEventListener('click', () => {
        miniGamesFacade.participateChestGameOnce();
    });

    function setupTimer() {
        timerTick();
        intervalId = window.setInterval(timerTick, Timing.SECOND);
    }

    function timerTick() {
        const time = miniGamesFacade.timeUntilChestMessage;
        const diff = time - Date.now();
        const minutes = Math.floor(diff / Timing.MINUTE).toString().padStart(2, '0');
        const seconds = Math.floor((diff % Timing.MINUTE) / Timing.SECOND).toString().padStart(2, '0');

        timerEl.textContent = `(${minutes}:${seconds})`;
        timerEl.classList.toggle('hidden', time <= 0);
    }
};
