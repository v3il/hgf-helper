import { BasicView } from '@components/BasicView';
import { AuthFacade, GlobalSettingsKeys, SettingsFacade } from '@shared/modules';
import { debounce } from '@utils';
import { Container } from 'typedi';
import template from './template.html?raw';

type Control = HTMLInputElement | HTMLSelectElement;

export class SettingsEditorView extends BasicView {
    private readonly authFacade: AuthFacade;
    private readonly settingsFacade: SettingsFacade;
    private readonly appEl: HTMLElement;

    constructor(appEl: HTMLElement) {
        super(template);

        this.appEl = appEl;

        this.authFacade = Container.get(AuthFacade);
        this.settingsFacade = Container.get(SettingsFacade);

        this.render();
        this.listenEvents();
    }

    render() {
        this.appEl.appendChild(this.el);
        this.el.querySelector('[data-username]')!.textContent = this.authFacade.userName;
        this.el.querySelectorAll<Control>('[data-setting]').forEach((control) => this.initSettingView(control));
    }

    private listenEvents() {
        this.el.querySelector('[data-logout]')!.addEventListener('click', () => {
            this.authFacade.logout();
        });
    }

    initSettingView(control: Control) {
        const settingName = control.dataset.setting as GlobalSettingsKeys;

        if (control instanceof HTMLInputElement && control.type === 'checkbox') {
            control.checked = this.settingsFacade.settings[settingName] as boolean;
        } else {
            control.value = String(this.settingsFacade.settings[settingName]);
        }

        control.addEventListener('change', debounce(() => {
            this.settingsFacade.updateSettings({
                [settingName]: this.parseInputValue(control)
            });
        }, 200));
    }

    parseInputValue(control: Control) {
        if (control instanceof HTMLInputElement && control.type === 'checkbox') {
            return control.checked;
        }

        if (control instanceof HTMLInputElement && control.type === 'range') {
            return Number(control.value);
        }

        return control.value;
    }
}
