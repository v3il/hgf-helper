import './popup.css';
import { SettingsFacade } from '@/shared/settings';

function initTextInputSetting(settingName, normalizer) {
    const input = document.querySelector(`[data-prop="${settingName}"]`);

    input.value = SettingsFacade.instance.getGlobalSetting(settingName);

    input.addEventListener('change', () => {
        const value = normalizer ? normalizer(input.value) : input.value;

        input.value = value;

        SettingsFacade.instance.updateGlobalSettings({
            [settingName]: value
        });
    });
}

const settingsNormalizer = {
    offersMaxPrice: (value) => {
        const numericValue = Number.parseInt(value, 10);
        return Number.isNaN(numericValue) ? 0 : numericValue;
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    await SettingsFacade.instance.loadSettings();

    ['jsonBinUrl', 'jsonBinMasterKey', 'jsonBinAccessKey', 'offersMaxPrice'].forEach((settingName) => {
        initTextInputSetting(settingName, settingsNormalizer[settingName]);
    });
});
