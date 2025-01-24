import './style.css';
import { SettingsFacade } from '@components/shared';

type SettingParser<T = string | boolean | number> = (inputEl: HTMLInputElement) => T;

const stringParser = (inputEl: HTMLInputElement) => inputEl.value;
const numberParser = (inputEl: HTMLInputElement) => Number(inputEl.value);
const booleanParser = (inputEl: HTMLInputElement) => inputEl.checked;

const settings = {
    jsonBinUrl: stringParser,
    jsonBinMasterKey: stringParser,
    jsonBinAccessKey: stringParser,
    offersMaxPrice: numberParser,
    openAiApiToken: stringParser,
    enableLogs: booleanParser
};

function initSettingView(settingName: string, settingNormalizer: SettingParser) {
    const el = document.querySelector(`[data-setting="${settingName}"]`)!;
    const inputEl = el.querySelector('[data-input]')! as HTMLInputElement;
    const valueEl = el.querySelector('[data-value]')!;

    inputEl.value = SettingsFacade.instance.getGlobalSetting(settingName);

    if (valueEl) {
        valueEl.textContent = inputEl.value;

        inputEl.addEventListener('input', () => {
            valueEl.textContent = inputEl.value;
        });
    }

    inputEl.addEventListener('change', () => {
        SettingsFacade.instance.updateGlobalSettings({
            [settingName]: settingNormalizer(inputEl)
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await SettingsFacade.instance.loadSettings();

    Object.entries(settings).forEach(([settingName, settingNormalizer]) => {
        initSettingView(settingName, settingNormalizer);
    });
});
