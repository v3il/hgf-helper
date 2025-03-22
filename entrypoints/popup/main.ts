import 'reflect-metadata';
import './style.css';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/range/range.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import { GlobalSettingsKeys, GlobalSettingsService } from '@components/settings';
import { SlInput, SlRange, SlSwitch, SlSelect } from '@shoelace-style/shoelace';
import { Container } from 'typedi';

const globalSettingsService = Container.get(GlobalSettingsService);

setBasePath('../..'); // /public

type Control = SlInput | SlRange | SlSwitch | SlSelect;

function parseInputValue(control: Control) {
    if (control instanceof SlSwitch) {
        return control.checked;
    }

    return control instanceof SlRange ? Number(control.value) : control.value;
}

function initSettingView(control: Control) {
    const settingName = control.dataset.setting as GlobalSettingsKeys;

    if (control instanceof SlSwitch) {
        control.checked = globalSettingsService.settings[settingName] as boolean;
    } else {
        control.value = String(globalSettingsService.settings[settingName]);
    }

    control.addEventListener('sl-input', () => {
        globalSettingsService.updateSettings({
            [settingName]: parseInputValue(control)
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await globalSettingsService.loadSettings();
    document.querySelectorAll<Control>('[data-setting]').forEach(initSettingView);
});
