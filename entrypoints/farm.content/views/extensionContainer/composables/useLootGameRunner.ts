import { LootGameService } from '@farm/modules/miniGames';
import { Timing } from '@farm/consts';
import { StreamFacade } from '@farm/modules/stream';
import { SettingsFacade } from '@components/shared';
import { ChatFacade } from '@farm/modules/chat';

interface IParams {
    el: HTMLElement;
}

export const useLootGameRunner = ({ el }: IParams) => {
    const settingsFacade = SettingsFacade.instance;

    const lootGameRunner = new LootGameService({
        chatFacade: ChatFacade.instance
    });

    const checkboxEl = el.querySelector<HTMLInputElement>('[data-loot-game]')!;
    const buttonEl = el.querySelector<HTMLInputElement>('[data-loot-game-button]')!;
    const timerEl = el.querySelector<HTMLButtonElement>('[data-loot-time]')!;

    let intervalId: number;

    checkboxEl.checked = settingsFacade.localSettings.detectLootGame;

    checkboxEl.addEventListener('change', () => {
        settingsFacade.updateLocalSettings({
            detectLootGame: checkboxEl.checked
        });

        if (!checkboxEl.checked) {
            lootGameRunner.stop();
            clearInterval(intervalId);
            timerEl.classList.add('hidden');
        }
    });

    StreamFacade.instance.streamService.events.on('loot', (isRunning: boolean) => {
        buttonEl.disabled = !isRunning;

        if (!settingsFacade.localSettings.detectLootGame) return;

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
