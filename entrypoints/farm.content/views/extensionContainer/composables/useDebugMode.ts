import { DebugModeView } from '@farm/views';
import { TwitchFacade } from '@farm/modules/twitch';

export const useDebugMode = (twitchFacade: TwitchFacade) => {
    const debugModeView = new DebugModeView(twitchFacade);

    window.document.addEventListener('keydown', (event) => {
        // Ctrl + 0
        if (event.ctrlKey && event.key === '0') {
            event.preventDefault();
            debugModeView.toggle();
        }
    });
};
