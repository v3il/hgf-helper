import { BasicView } from '@components/BasicView';
import { AuthFacade } from '@shared/modules';
import { Container } from 'typedi';
import { AuthWindow } from '@components/AuthWindow';
import { AUTH_URL } from '@shared/consts';
import template from './template.html?raw';

export class AuthView extends BasicView {
    private readonly authFacade: AuthFacade;
    private readonly appEl: HTMLElement;

    constructor(appEl: HTMLElement) {
        super(template);

        this.appEl = appEl;
        this.authFacade = Container.get(AuthFacade);

        this.render();
        this.listenEvents();
    }

    render() {
        this.appEl.appendChild(this.el);
    }

    private listenEvents() {
        this.el.querySelector('[data-authorize]')!.addEventListener('click', async () => {
            try {
                const authWindow = new AuthWindow();
                const token = await authWindow.open(AUTH_URL);

                if (token) {
                    await this.authFacade.auth(token);
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
}
