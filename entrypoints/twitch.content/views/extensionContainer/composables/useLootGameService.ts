import { LootGameService } from '@twitch/modules/miniGames';
import { Timing } from '@components/consts';
import { StreamStatusService } from '@twitch/modules/stream';
import { LocalSettingsService } from '@components/settings';
import { Container } from 'typedi';

interface IParams {
    el: HTMLElement;
}

export const useLootGameService = ({ el }: IParams) => {
    const streamService = Container.get(StreamStatusService);
    const settingsService = Container.get(LocalSettingsService);

    const lootGameService = new LootGameService();

    const checkboxEl = el.querySelector<HTMLInputElement>('[data-loot-game]')!;
    const buttonEl = el.querySelector<HTMLInputElement>('[data-loot-game-button]')!;
    const timerEl = el.querySelector<HTMLButtonElement>('[data-loot-time]')!;

    let intervalId: number;

    checkboxEl.checked = settingsService.settings.lootGame;

    checkboxEl.addEventListener('change', () => {
        settingsService.updateSettings({
            lootGame: checkboxEl.checked
        });

        if (!checkboxEl.checked) {
            lootGameService.stop();
            clearInterval(intervalId);
            timerEl.classList.add('hidden');
        }
    });

    streamService.events.on('loot', (isRunning) => {
        buttonEl.disabled = !isRunning;

        if (!settingsService.settings.lootGame) return;

        if (isRunning) {
            lootGameService.start();
            setupTimer();
        } else {
            lootGameService.stop();
            clearInterval(intervalId);
            timerEl.classList.add('hidden');
        }
    });

    lootGameService.events.on('roundCompleted', () => {
        timerEl.classList.add('hidden');
        clearInterval(intervalId);
    });

    buttonEl.addEventListener('click', () => {
        lootGameService.participate();
    });

    function setupTimer() {
        timerTick();
        timerEl.classList.remove('hidden');
        intervalId = window.setInterval(timerTick, Timing.SECOND);
    }

    function timerTick() {
        const time = lootGameService.timeUntilMessage;
        const diff = Math.max(time - Date.now(), 0);
        const minutes = Math.floor(diff / Timing.MINUTE).toString().padStart(2, '0');
        const seconds = Math.floor((diff % Timing.MINUTE) / Timing.SECOND).toString().padStart(2, '0');

        timerEl.textContent = `(${minutes}:${seconds})`;
    }
};
