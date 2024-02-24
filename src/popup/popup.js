import './popup.css';
import { SettingsFacade } from '@/shared/settings';

const settings = {
    jsonBinUrl: String,
    jsonBinMasterKey: String,
    jsonBinAccessKey: String,
    offersMaxPrice: Number
};

function initSettingView(settingName, settingNormalizer) {
    const el = document.querySelector(`[data-setting="${settingName}"]`);
    const inputEl = el.querySelector('[data-input]');
    const valueEl = el.querySelector('[data-value]');

    inputEl.value = SettingsFacade.instance.getGlobalSetting(settingName);

    if (valueEl) {
        valueEl.textContent = inputEl.value;

        inputEl.addEventListener('input', () => {
            valueEl.textContent = inputEl.value;
        });
    }

    inputEl.addEventListener('change', () => {
        SettingsFacade.instance.updateGlobalSettings({
            [settingName]: settingNormalizer(inputEl.value)
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await SettingsFacade.instance.loadSettings();

    Object.entries(settings).forEach(([settingName, settingNormalizer]) => {
        initSettingView(settingName, settingNormalizer);
    });
});
