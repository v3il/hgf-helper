import { MiniGamesFacade } from '@farm/modules/miniGames';
import { SettingsFacade } from '@components/shared';

interface IParams {
    el: HTMLElement;
    settingsFacade: SettingsFacade;
    miniGamesFacade: MiniGamesFacade
}

export const useAkiraDrawingRunner = ({ el, miniGamesFacade, settingsFacade }: IParams) => {
    const hitsquadCheckboxEl = el.querySelector<HTMLInputElement>('[data-toggle-akira-drawing]')!;

    hitsquadCheckboxEl.checked = miniGamesFacade.isAkiraDrawRunning;

    if (!isTokenProvided()) {
        hitsquadCheckboxEl.checked = false;
    }

    hitsquadCheckboxEl.addEventListener('change', () => {
        if (!isTokenProvided()) {
            hitsquadCheckboxEl.checked = false;
            alert('Please provide OpenAI API token in settings');
        }

        hitsquadCheckboxEl.checked ? miniGamesFacade.startAkiraDrawRunner() : miniGamesFacade.stopAkiraDrawRunner();
    });

    function isTokenProvided() {
        return !!settingsFacade.getGlobalSetting('openAiApiToken');
    }
};
