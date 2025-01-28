import { MiniGamesFacade } from '@farm/modules/miniGames';
import { SettingsFacade } from '@components/shared';
import { ChatFacade } from '@farm/modules/chat';
import { Timing } from '@farm/consts';

interface IParams {
    el: HTMLElement;
    settingsFacade: SettingsFacade;
    miniGamesFacade: MiniGamesFacade
    chatFacade: ChatFacade
}

export const useAkiraDrawingRunner = ({
    el, miniGamesFacade, settingsFacade, chatFacade
}: IParams) => {
    const checkboxEl = el.querySelector<HTMLInputElement>('[data-toggle-akira-drawing]')!;
    const buttonEl = el.querySelector<HTMLInputElement>('[data-akira-drawing]')!;
    const timerEl = el.querySelector<HTMLButtonElement>('[data-akira-drawing-time]')!;

    let intervalId: number;

    checkboxEl.checked = miniGamesFacade.isAkiraDrawRunning;

    if (miniGamesFacade.isAkiraDrawRunning) {
        setupTimer();
    }

    if (!isTokenProvided()) {
        checkboxEl.checked = false;
    }

    checkboxEl.addEventListener('change', () => {
        if (!isTokenProvided()) {
            checkboxEl.checked = false;
            return showAlert();
        }

        if (checkboxEl.checked) {
            miniGamesFacade.startAkiraDrawRunner();
            return setupTimer();
        }

        miniGamesFacade.stopAkiraDrawRunner();
        clearInterval(intervalId);
        timerEl.classList.add('hidden');
    });

    buttonEl.addEventListener('click', (event) => {
        if (!isTokenProvided()) {
            return showAlert();
        }

        if (event.ctrlKey) {
            chatFacade.withoutSuppression(() => miniGamesFacade.participateAkiraDrawingOnce());
        } else {
            miniGamesFacade.participateAkiraDrawingOnce();
        }
    });

    function isTokenProvided() {
        return !!settingsFacade.globalSettings.openAiApiToken;
    }

    function showAlert() {
        alert('Please provide OpenAI API token in settings');
    }

    function setupTimer() {
        timerTick();
        intervalId = window.setInterval(timerTick, Timing.SECOND);
    }

    function timerTick() {
        const time = miniGamesFacade.timeUntilAkiraDrawingMessage;
        const diff = time - Date.now();
        const minutes = Math.floor(diff / Timing.MINUTE).toString().padStart(2, '0');
        const seconds = Math.floor((diff % Timing.MINUTE) / Timing.SECOND).toString().padStart(2, '0');

        timerEl.textContent = `(${minutes}:${seconds})`;
        timerEl.classList.toggle('hidden', time <= 0);
    }
};
