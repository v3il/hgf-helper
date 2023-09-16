import { SettingsService } from './SettingsService';

chrome.runtime.onInstalled.addListener(async () => {
    for (const contentScript of chrome.runtime.getManifest().content_scripts) {
        for (const tab of await chrome.tabs.query({ url: contentScript.matches })) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: contentScript.js
            });
        }
    }
});

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
