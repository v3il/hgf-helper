import { StreamElementsUIService } from '@store/modules';
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import { BasicView, AuthWindow } from '@shared/views';
import { AUTH_URL } from '@shared/consts';
import template from './template.html?raw';

export class AuthView extends BasicView {
    private readonly streamElementsUIService: StreamElementsUIService;
    private readonly authFacade: AuthFacade;

    constructor() {
        super(template);

        this.authFacade = Container.get(AuthFacade);
        this.streamElementsUIService = Container.get(StreamElementsUIService);

        this.triggerAuth = this.triggerAuth.bind(this);

        this.render();
        this.listenEvents();
    }

    render() {
        this.streamElementsUIService.pageContentEl!.insertAdjacentElement('afterbegin', this.el);
    }

    destroy() {
        this.el.querySelector('[data-authorize]')!.removeEventListener('click', this.triggerAuth);
        super.destroy();
    }

    private listenEvents() {
        this.el.querySelector('[data-authorize]')!.addEventListener('click', this.triggerAuth);
    }

    private async triggerAuth() {
        try {
            const authWindow = new AuthWindow();
            const token = await authWindow.open(AUTH_URL);

            if (token) {
                await this.authFacade.auth(token);
            }
        } catch (error) {
            console.error(error);
        }
    }
}
