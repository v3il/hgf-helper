import { MiniGamesFacade } from '@farm/modules/miniGames';
import { Timing } from '@farm/consts';

interface IParams {
    el: HTMLElement;
    miniGamesFacade: MiniGamesFacade
}

export const useLootGameRunner = ({ el, miniGamesFacade }: IParams) => {
    const checkboxEl = el.querySelector<HTMLInputElement>('[data-toggle-loot-game]')!;
    const buttonEl = el.querySelector<HTMLInputElement>('[data-loot-game-button]')!;
    const timerEl = el.querySelector<HTMLButtonElement>('[data-loot-time]')!;

    let intervalId: number;

    checkboxEl.checked = miniGamesFacade.isLootGameRunning;

    if (miniGamesFacade.isLootGameRunning) {
        setupTimer();
    }

    checkboxEl.addEventListener('change', () => {
        if (checkboxEl.checked) {
            miniGamesFacade.startLootRunner();
            return setupTimer();
        }

        miniGamesFacade.stopLootRunner();
        clearInterval(intervalId);
        timerEl.classList.add('hidden');
    });

    buttonEl.addEventListener('click', () => {
        miniGamesFacade.participateLootGameOnce();
    });

    function setupTimer() {
        timerTick();
        intervalId = window.setInterval(timerTick, Timing.SECOND);
    }

    function timerTick() {
        const time = miniGamesFacade.timeUntilLootMessage;
        const diff = time - Date.now();
        const minutes = Math.floor(diff / Timing.MINUTE).toString().padStart(2, '0');
        const seconds = Math.floor((diff % Timing.MINUTE) / Timing.SECOND).toString().padStart(2, '0');

        timerEl.textContent = `(${minutes}:${seconds})`;
        timerEl.classList.toggle('hidden', time <= 0);
    }
};
