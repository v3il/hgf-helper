import { MiniGamesFacade } from '@farm/modules/miniGames';
import { SettingsFacade } from '@components/shared';
import { ChatFacade } from '@farm/modules/chat';

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

    checkboxEl.checked = miniGamesFacade.isAkiraDrawRunning;

    if (!isTokenProvided()) {
        checkboxEl.checked = false;
    }

    checkboxEl.addEventListener('change', () => {
        if (!isTokenProvided()) {
            checkboxEl.checked = false;
            return showAlert();
        }

        checkboxEl.checked ? miniGamesFacade.startAkiraDrawRunner() : miniGamesFacade.stopAkiraDrawRunner();
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
};
