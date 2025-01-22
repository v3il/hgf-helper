import { MiniGamesFacade } from '@farm/modules/miniGames';

interface IParams {
    el: HTMLElement;
    miniGamesFacade: MiniGamesFacade
}

export const useAkiraDrawingRunner = ({ el, miniGamesFacade }: IParams) => {
    const hitsquadCheckboxEl = el.querySelector<HTMLInputElement>('[data-toggle-akira-drawing]')!;

    hitsquadCheckboxEl.checked = miniGamesFacade.isAkiraDrawRunning;

    hitsquadCheckboxEl.addEventListener('change', () => {
        hitsquadCheckboxEl.checked ? miniGamesFacade.startAkiraDrawRunner() : miniGamesFacade.stopAkiraDrawRunner();
    });
};
