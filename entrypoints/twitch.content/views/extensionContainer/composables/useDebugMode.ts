import { DebugModeView } from '@twitch/views';

export const useDebugMode = () => {
    const debugModeView = new DebugModeView();

    window.document.addEventListener('keydown', (event) => {
        // Ctrl + 0
        if (event.ctrlKey && event.key === '0') {
            event.preventDefault();
            debugModeView.toggle();
        }
    });
};
