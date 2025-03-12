import 'reflect-metadata';
import './style.css';
import { SettingsFacade, GlobalSettingsKeys } from '@components/shared';

function parseInputValue(inputEl: HTMLInputElement) {
    if (inputEl.type === 'checkbox') {
        return inputEl.checked;
    }

    if (inputEl.type === 'number' || inputEl.type === 'range') {
        return Number(inputEl.value);
    }

    return inputEl.value;
}

function initSettingView(el: HTMLElement) {
    const settingName = el.dataset.setting as GlobalSettingsKeys;
    const inputEl = el.querySelector('[data-input]')! as HTMLInputElement;
    const valueEl = el.querySelector('[data-value]');

    if (inputEl.type === 'checkbox') {
        inputEl.checked = SettingsFacade.instance.globalSettings[settingName] as unknown as boolean;
    } else {
        inputEl.value = String(SettingsFacade.instance.globalSettings[settingName]);
    }

    if (valueEl) {
        valueEl.textContent = inputEl.value;

        inputEl.addEventListener('input', () => {
            valueEl.textContent = inputEl.value;
        });
    }

    inputEl.addEventListener('change', () => {
        SettingsFacade.instance.updateGlobalSettings({
            [settingName]: parseInputValue(inputEl)
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await SettingsFacade.instance.loadSettings();

    document.querySelectorAll<HTMLInputElement>('[data-setting]').forEach(initSettingView);
});
