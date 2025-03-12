import { AkiraDrawingService } from '@farm/modules/miniGames';
import { AiGeneratorService, SettingsFacade } from '@components/shared';
import { Timing } from '@farm/consts';
import { ChatFacade } from '@farm/modules/chat';
import { TwitchFacade } from '@farm/modules/twitch';

interface IParams {
    el: HTMLElement;
}

export const useAkiraDrawingService = ({ el }: IParams) => {
    const settingsFacade = SettingsFacade.instance;

    const gameService = new AkiraDrawingService({
        chatFacade: ChatFacade.instance,
        settingsFacade: SettingsFacade.instance,
        twitchFacade: TwitchFacade.instance,
        aiGeneratorService: new AiGeneratorService()
    });

    const checkboxEl = el.querySelector<HTMLInputElement>('[data-toggle-akira-drawing]')!;
    const buttonEl = el.querySelector<HTMLInputElement>('[data-akira-drawing]')!;
    const timerEl = el.querySelector<HTMLButtonElement>('[data-akira-drawing-time]')!;

    let intervalId: number;

    checkboxEl.checked = gameService.isRunning;

    if (gameService.isRunning) {
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
            gameService.start();
            return setupTimer();
        }

        gameService.stop();
        clearInterval(intervalId);
        timerEl.classList.add('hidden');
    });

    buttonEl.addEventListener('click', (event) => {
        if (!isTokenProvided()) {
            return showAlert();
        }

        gameService.participate();
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
        const time = gameService.timeUntilMessage;
        const diff = time - Date.now();
        const minutes = Math.floor(diff / Timing.MINUTE).toString().padStart(2, '0');
        const seconds = Math.floor((diff % Timing.MINUTE) / Timing.SECOND).toString().padStart(2, '0');

        timerEl.textContent = `(${minutes}:${seconds})`;
        timerEl.classList.toggle('hidden', time <= 0);
    }
};
