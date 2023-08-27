import { SettingsService } from './SettingsService';

(async () => {
    const settingsService = new SettingsService();

    await settingsService.loadSettings();

    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        const { action, ...settings } = message;

        if (action === 'LOAD_SETTINGS') {
            return sendResponse(settingsService.settings);
        }

        if (action === 'UPDATE_SETTINGS') {
            settingsService.updateSettings(settings);
            return sendResponse(true);
        }
    });
})();
