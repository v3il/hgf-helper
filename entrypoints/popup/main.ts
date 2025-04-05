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
import { GlobalSettingsKeys, SettingsFacade, AuthFacade } from '@shared/modules';
import { SlInput, SlRange, SlSwitch, SlSelect } from '@shoelace-style/shoelace';
import { Container } from 'typedi';
import { debounce } from '@utils';

const settingsFacade = Container.get(SettingsFacade);
const authFacade = Container.get(AuthFacade);

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
        control.checked = settingsFacade.settings[settingName] as boolean;
    } else {
        control.value = String(settingsFacade.settings[settingName]);
    }

    control.addEventListener('sl-input', debounce(() => {
        settingsFacade.updateSettings({
            [settingName]: parseInputValue(control)
        });
    }, 200));
}

document.addEventListener('DOMContentLoaded', async () => {
    await authFacade.auth();

    document.querySelectorAll<Control>('[data-setting]').forEach(initSettingView);

    document.querySelector<HTMLButtonElement>('[data-logout]')!.addEventListener('click', () => {
        authFacade.logout();
    });
});
