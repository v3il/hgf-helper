import { Timing } from '@shared/consts';
import { StreamStatusService } from '@twitch/modules/stream';
import { ChestGameService } from '@twitch/modules/miniGames';
import { Container } from 'typedi';
import { SettingsFacade } from '@shared/modules';

interface IParams {
    el: HTMLElement;
}

export interface IChestGameService {
    destroy: () => void;
}

export const useChestGameService = ({ el }: IParams): IChestGameService => {
    const settingsFacade = Container.get(SettingsFacade);
    const streamService = Container.get(StreamStatusService);

    const chestGameRunner = new ChestGameService();

    const checkboxEl = el.querySelector<HTMLInputElement>('[data-chest-game]')!;
    const buttonEl = el.querySelector<HTMLInputElement>('[data-chest-game-button]')!;
    const timerEl = el.querySelector<HTMLButtonElement>('[data-chest-time]')!;

    let intervalId: number;

    checkboxEl.checked = settingsFacade.settings.chestGame;

    const checkboxChangeHandler = async () => {
        await settingsFacade.updateSettings({
            chestGame: checkboxEl.checked
        });

        if (!checkboxEl.checked) {
            chestGameRunner.stop();
            clearInterval(intervalId);
            timerEl.classList.add('hidden');
        }
    };

    checkboxEl.addEventListener('change', checkboxChangeHandler);

    const unsubscribeChest = streamService.events.on('chest', (isRunning) => {
        buttonEl.disabled = !isRunning;

        if (!settingsFacade.settings.chestGame) return;

        if (isRunning) {
            chestGameRunner.start();
            setupTimer();
        } else {
            chestGameRunner.stop();
            clearInterval(intervalId);
            timerEl.classList.add('hidden');
        }
    });

    const buttonClickHandler = () => {
        chestGameRunner.participate();
    };

    const unsubscribeRoundCompleted = chestGameRunner.events.on('roundCompleted', () => {
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
        const time = chestGameRunner.timeUntilMessage;
        const diff = Math.max(time - Date.now(), 0);
        const minutes = Math.floor(diff / Timing.MINUTE).toString().padStart(2, '0');
        const seconds = Math.floor((diff % Timing.MINUTE) / Timing.SECOND).toString().padStart(2, '0');

        timerEl.textContent = `(${minutes}:${seconds})`;
    }

    return {
        destroy: () => {
            clearInterval(intervalId);
            chestGameRunner.stop();
            unsubscribeChest();
            unsubscribeRoundCompleted();
            checkboxEl.removeEventListener('change', checkboxChangeHandler);
            buttonEl.removeEventListener('click', buttonClickHandler);
        }
    };
};
