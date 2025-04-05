import 'reflect-metadata';
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import { ExtensionContainer } from './views';
import './store.css';
import '@shared/styles/index.css';

export const start = async () => {
    const authFacade = Container.get(AuthFacade);

    authFacade.auth()
        .catch((error) => console.error('Error during authentication:', error))
        .finally(() => new ExtensionContainer());
};
