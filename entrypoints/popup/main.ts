import 'reflect-metadata';
import './style.css';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/range/range.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import { SettingsFacade, GlobalSettingsKeys } from '@components/shared';
import { SlInput, SlRange, SlSwitch } from '@shoelace-style/shoelace';

setBasePath('../..'); // /assets

type Control = SlInput | SlRange | SlSwitch

function parseInputValue(control: Control) {
    if (control instanceof SlSwitch) {
        return control.checked;
    }

    return control instanceof SlRange ? Number(control.value) : control.value;
}

function initSettingView(control: Control) {
    const settingName = control.dataset.setting as GlobalSettingsKeys;

    if (control instanceof SlSwitch) {
        control.checked = SettingsFacade.instance.globalSettings[settingName] as boolean;
    } else {
        control.value = String(SettingsFacade.instance.globalSettings[settingName]);
    }

    control.addEventListener('sl-input', () => {
        SettingsFacade.instance.updateGlobalSettings({
            [settingName]: parseInputValue(control)
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await SettingsFacade.instance.loadSettings();
    document.querySelectorAll<Control>('[data-setting]').forEach(initSettingView);
});
