import { LootGameService } from '@twitch/modules/miniGames';
import { Timing } from '@shared/consts';
import { StreamStatusService } from '@twitch/modules/stream';
import { Container } from 'typedi';
import { SettingsFacade } from '@shared/modules';

interface IParams {
    el: HTMLElement;
}

export interface ILootGameService {
    destroy: () => void;
}

export const useLootGameService = ({ el }: IParams): ILootGameService => {
    const settingsFacade = Container.get(SettingsFacade);
    const streamService = Container.get(StreamStatusService);

    const lootGameService = new LootGameService();

    const checkboxEl = el.querySelector<HTMLInputElement>('[data-loot-game]')!;
    const buttonEl = el.querySelector<HTMLInputElement>('[data-loot-game-button]')!;
    const timerEl = el.querySelector<HTMLButtonElement>('[data-loot-time]')!;

    let intervalId: number;

    checkboxEl.checked = settingsFacade.settings.lootGame;

    const checkboxChangeHandler = async () => {
        await settingsFacade.updateSettings({
            lootGame: checkboxEl.checked
        });

        if (!checkboxEl.checked) {
            lootGameService.stop();
            clearInterval(intervalId);
            timerEl.classList.add('hidden');
        }
    };

    const buttonClickHandler = () => {
        lootGameService.participate();
    };

    checkboxEl.addEventListener('change', checkboxChangeHandler);

    const unsubscribeLoot = streamService.events.on('loot', (isRunning) => {
        buttonEl.disabled = !isRunning;

        if (!settingsFacade.settings.lootGame) return;

        if (isRunning) {
            lootGameService.start();
            setupTimer();
        } else {
            lootGameService.stop();
            clearInterval(intervalId);
            timerEl.classList.add('hidden');
        }
    });

    const unsubscribeRoundCompleted = lootGameService.events.on('roundCompleted', () => {
        timerEl.classList.add('hidden');
        clearInterval(intervalId);
    });

    buttonEl.addEventListener('click', buttonClickHandler);

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

    return {
        destroy: () => {
            clearInterval(intervalId);
            lootGameService.stop();
            unsubscribeLoot();
            unsubscribeRoundCompleted();
            checkboxEl.removeEventListener('change', checkboxChangeHandler);
            buttonEl.removeEventListener('click', buttonClickHandler);
        }
    };
};
