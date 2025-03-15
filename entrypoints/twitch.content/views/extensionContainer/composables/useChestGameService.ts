import { Timing } from '@components/consts';
import { StreamStatusService } from '@twitch/modules/stream';
import { LocalSettingsService } from '@components/settings';
import { ChestGameService } from '@twitch/modules/miniGames';
import { Container } from 'typedi';

interface IParams {
    el: HTMLElement;
}

export const useChestGameService = ({ el }: IParams) => {
    const settingsService = Container.get(LocalSettingsService);
    const streamService = Container.get(StreamStatusService);

    const chestGameRunner = new ChestGameService();

    const checkboxEl = el.querySelector<HTMLInputElement>('[data-chest-game]')!;
    const buttonEl = el.querySelector<HTMLInputElement>('[data-chest-game-button]')!;
    const timerEl = el.querySelector<HTMLButtonElement>('[data-chest-time]')!;

    let intervalId: number;

    checkboxEl.checked = settingsService.settings.chestGame;

    checkboxEl.addEventListener('change', () => {
        settingsService.updateSettings({
            chestGame: checkboxEl.checked
        });

        if (!checkboxEl.checked) {
            chestGameRunner.stop();
            clearInterval(intervalId);
            timerEl.classList.add('hidden');
        }
    });

    streamService.events.on('chest', (isRunning) => {
        buttonEl.disabled = !isRunning;

        if (!settingsService.settings.chestGame) return;

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
