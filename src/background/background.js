import { SettingsService } from './SettingsService';
import { BackgroundActions } from '../shared/enums/BackgroundActions';

chrome.runtime.onInstalled.addListener(async (det) => {
    console.error(det);

    const settingsService = new SettingsService();

    await settingsService.loadSettings();

    console.error('Installed:', settingsService.settings);

    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        const { action, ...settings } = message;

        if (action === BackgroundActions.LOAD_SETTINGS) {
            return sendResponse(settingsService.settings);
        }

        if (action === BackgroundActions.UPDATE_SETTINGS) {
            settingsService.updateSettings(settings);
            return sendResponse(true);
        }
    });
});

// (async () => {
//     const settingsService = new SettingsService();
//
//     await settingsService.loadSettings();
//
//     chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
//         const { action, ...settings } = message;
//
//         if (action === BackgroundActions.LOAD_SETTINGS) {
//             return sendResponse(settingsService.settings);
//         }
//
//         if (action === BackgroundActions.UPDATE_SETTINGS) {
//             settingsService.updateSettings(settings);
//             return sendResponse(true);
//         }
//     });
// })();
