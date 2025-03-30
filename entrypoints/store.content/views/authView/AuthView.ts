import { StreamElementsUIService } from '@store/modules';
import { Container } from 'typedi';
import { UserFacade } from '@shared/settings';
import { AuthWindow } from '@components/AuthWindow';
import { BasicView } from '@components/BasicView';
import { AUTH_URL } from '@shared/consts';
import template from './template.html?raw';

export class AuthView extends BasicView {
    private readonly streamElementsUIService: StreamElementsUIService;
    private readonly userFacade: UserFacade;

    constructor() {
        super(template);

        this.userFacade = Container.get(UserFacade);
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

            await this.userFacade.setToken(token);
            await this.userFacade.auth();
            this.events.emit('authenticated');
        } catch (error) {
            console.error(error);
        }
    }
}
