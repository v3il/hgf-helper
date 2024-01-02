import { Container } from 'typedi';
import { InjectionTokens } from '../consts';
import { EventEmitter } from '../models/EventsEmitter';

export class ExtensionFacade {
    static create({ canvasView }) {
        const twitchPlayerService = Container.get(InjectionTokens.PLAYER_SERVICE);

        return new ExtensionFacade({
            canvasView,
            twitchPlayerService,
            events: EventEmitter.create()
        });
    }
}
