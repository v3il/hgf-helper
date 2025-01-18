import './style.css';
import { BasicView } from '@components/shared';
import { ChatFacade } from '@farm/modules/chat';
import { MiniGamesFacade } from '@farm/modules/miniGames';
import { StreamFacade } from '@farm/modules/stream';
import { TwitchFacade } from '@farm/modules/twitch';
import {
    useDebugMode,
    useDelayRemover,
    useHitsquadButton,
    useStreamStatusChecker,
    useHitsquadHandler
} from './composables';
import template from './template.html?raw';

interface IParams {
    streamFacade: StreamFacade;
    chatFacade: ChatFacade;
    miniGamesFacade: MiniGamesFacade;
    twitchFacade: TwitchFacade;
}

export class ExtensionContainer extends BasicView {
    static create() {
        return new ExtensionContainer({
            streamFacade: StreamFacade.instance,
            chatFacade: ChatFacade.instance,
            miniGamesFacade: MiniGamesFacade.instance,
            twitchFacade: TwitchFacade.instance
        });
    }

    constructor(params: IParams) {
        super(template);

        const {
            streamFacade, chatFacade, miniGamesFacade, twitchFacade
        } = params;

        useDebugMode(twitchFacade);
        useDelayRemover(streamFacade);
        useStreamStatusChecker({ el: this.el, streamFacade });
        useHitsquadButton({ el: this.el, streamFacade, chatFacade });
        useHitsquadHandler({
            el: this.el,
            chatFacade,
            twitchFacade,
            miniGamesFacade
        });
    }
}
