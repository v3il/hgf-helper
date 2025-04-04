import { StreamElementsUIService } from '@store/modules';
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import { AuthWindow } from '@components/AuthWindow';
import { BasicView } from '@components/BasicView';
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

        this.listenEvents();
    }

    mount() {
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

            if (!token) {
                return;
            }

            await this.authFacade.setToken(token);
            await this.authFacade.auth();
            this.events.emit('authenticated');
        } catch (error) {
            console.error(error);
        }
    }
}
