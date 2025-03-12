import { Timing } from '@farm/consts';
import { StreamFacade } from '@farm/modules/stream';
import { SettingsFacade } from '@components/shared';
import { ChestGameService } from '@farm/modules/miniGames';
import { ChatFacade } from '@farm/modules/chat';

interface IParams {
    el: HTMLElement;
}

export const useChestGameService = ({ el }: IParams) => {
    const settingsFacade = SettingsFacade.instance;

    const chestGameRunner = new ChestGameService({
        chatFacade: ChatFacade.instance
    });

    const checkboxEl = el.querySelector<HTMLInputElement>('[data-chest-game]')!;
    const buttonEl = el.querySelector<HTMLInputElement>('[data-chest-game-button]')!;
    const timerEl = el.querySelector<HTMLButtonElement>('[data-chest-time]')!;

    let intervalId: number;

    checkboxEl.checked = settingsFacade.localSettings.chestGame;

    checkboxEl.addEventListener('change', () => {
        settingsFacade.updateLocalSettings({
            chestGame: checkboxEl.checked
        });

        if (!checkboxEl.checked) {
            chestGameRunner.stop();
            clearInterval(intervalId);
            timerEl.classList.add('hidden');
        }
    });

    StreamFacade.instance.streamService.events.on('chest', (isRunning: boolean) => {
        buttonEl.disabled = !isRunning;

        if (!settingsFacade.localSettings.chestGame) return;

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
