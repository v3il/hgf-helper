import { LootGameService } from '@twitch/modules/miniGames';
import { Timing } from '@components/consts';
import { StreamFacade } from '@twitch/modules/stream';
import { LocalSettingsService } from '@components/settings';
import { ChatFacade } from '@twitch/modules/chat';
import { Container } from 'typedi';

interface IParams {
    el: HTMLElement;
}

export const useLootGameService = ({ el }: IParams) => {
    const settingsService = Container.get(LocalSettingsService);

    const lootGameRunner = new LootGameService({
        chatFacade: ChatFacade.instance
    });

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
            lootGameRunner.stop();
            clearInterval(intervalId);
            timerEl.classList.add('hidden');
        }
    });

    StreamFacade.instance.streamService.events.on('loot', (isRunning) => {
        buttonEl.disabled = !isRunning;

        if (!settingsService.settings.lootGame) return;

        if (isRunning) {
            lootGameRunner.start();
            setupTimer();
        } else {
            lootGameRunner.stop();
            clearInterval(intervalId);
            timerEl.classList.add('hidden');
        }
    });

    buttonEl.addEventListener('click', () => {
        lootGameRunner.participate();
    });

    function setupTimer() {
        timerTick();
        intervalId = window.setInterval(timerTick, Timing.SECOND);
    }

    function timerTick() {
        const time = lootGameRunner.timeUntilMessage;
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
