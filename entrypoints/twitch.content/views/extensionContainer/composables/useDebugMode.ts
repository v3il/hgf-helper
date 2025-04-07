import { DebugModeView } from '@twitch/views';

export interface IDebugMode {
    destroy: () => void;
}

export const useDebugMode = (): IDebugMode => {
    const debugModeView = new DebugModeView();

    function keyDownHandler(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === '0') {
            event.preventDefault();
            debugModeView.toggle();
        }
    }

    window.document.addEventListener('keydown', keyDownHandler);

    return {
        destroy: () => {
            window.document.removeEventListener('keydown', keyDownHandler);
            debugModeView.destroy();
        }
    };
};
