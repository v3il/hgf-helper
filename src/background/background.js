import { SettingsService } from './SettingsService';

(async () => {
    const settingsService = new SettingsService();

    await settingsService.loadSettings();

    // eslint-disable-next-line no-undef
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        console.error('msg', message);

        sendResponse(settingsService.settings);
    });
})();
