import { MiniGamesFacade } from '@farm/modules/miniGames';
import { Timing } from '@farm/consts';
import { StreamFacade } from '@farm/modules/stream';
import { SettingsFacade } from '@components/shared';

interface IParams {
    el: HTMLElement;
    miniGamesFacade: MiniGamesFacade
    streamFacade: StreamFacade;
    settingsFacade: SettingsFacade;
}

export const useChestGameRunner = ({
    el, miniGamesFacade, streamFacade, settingsFacade
}: IParams) => {
    const { chestGameRunner } = miniGamesFacade;

    const checkboxEl = el.querySelector<HTMLInputElement>('[data-detect-chest-game]')!;
    const buttonEl = el.querySelector<HTMLInputElement>('[data-chest-game-button]')!;
    const timerEl = el.querySelector<HTMLButtonElement>('[data-chest-time]')!;

    let intervalId: number;

    checkboxEl.checked = settingsFacade.localSettings.detectChestGame;

    checkboxEl.addEventListener('change', () => {
        settingsFacade.updateLocalSettings({
            detectChestGame: checkboxEl.checked
        });

        if (!checkboxEl.checked) {
            chestGameRunner.stop();
            clearInterval(intervalId);
            timerEl.classList.add('hidden');
        }
    });

    streamFacade.streamService.events.on('chest', (isRunning) => {
        buttonEl.disabled = !isRunning;

        if (!settingsFacade.localSettings.detectChestGame) return;

        if (isRunning) {
            chestGameRunner.start();
            setupTimer();
        } else {
            chestGameRunner.stop();
            clearInterval(intervalId);
            timerEl.classList.add('hidden');
        }
    });

    buttonEl.addEventListener('click', () => {
        chestGameRunner.participate();
    });

    function setupTimer() {
        timerTick();
        intervalId = window.setInterval(timerTick, Timing.SECOND);
    }

    function timerTick() {
        const time = chestGameRunner.timeUntilMessage;
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
