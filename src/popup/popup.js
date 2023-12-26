import { SettingsService } from './SettingsService';

document.addEventListener('DOMContentLoaded', async () => {
    const settingsService = SettingsService.create();

    await settingsService.loadSettings();

    Object.entries(settingsService.settings).forEach(([key, value]) => {
        const input = document.querySelector(`[data-prop="${key}"]`);

        if (!input) return;

        input.value = value;

        input.addEventListener('change', () => {
            settingsService.updateSettings({
                [key]: input.value
            });
        });
    });
});
