import './popup.css';
import { SettingsFacade } from '../shared/settings';

document.addEventListener('DOMContentLoaded', async () => {
    await SettingsFacade.instance.loadSettings();

    Object.entries(SettingsFacade.instance.globalSettings).forEach(([key, value]) => {
        const input = document.querySelector(`[data-prop="${key}"]`);

        if (!input) return;

        input.value = value;

        input.addEventListener('change', () => {
            SettingsFacade.instance.updateGlobalSettings({
                [key]: input.value
            });
        });
    });
});
