import 'reflect-metadata';
import { ExtensionContainer } from '@twitch/views';
import { Container } from 'typedi';
import { TwitchUIService } from '@twitch/modules';
import { AuthFacade } from '@shared/modules';
import { isDev } from '@shared/consts';
import { log } from '@utils';

let extensionContainer: ExtensionContainer | null = null;

export const main = async () => {
    const twitchUIService = Container.get(TwitchUIService);
    const authFacade = Container.get(AuthFacade);

    await authFacade
        .auth()
        .catch((error) => console.error('Error during authentication:', error));

    console.clear();
    log(`Running in ${isDev ? 'dev' : 'prod'} mode`);

    if (authFacade.isAuthenticated) {
        twitchUIService.whenStreamReady(async () => {
            extensionContainer = new ExtensionContainer();
        });
    }

    authFacade.onAuthenticated(() => {
        extensionContainer = new ExtensionContainer();
    });

    authFacade.onLogout(() => {
        extensionContainer?.destroy();
    });
};
