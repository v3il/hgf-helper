import './style.css';
import { BasicView } from '@components/BasicView';
import {
    useChestGameService,
    useDebugMode,
    useDelayRemover,
    useHitsquadService,
    useLootGameService,
    useStreamStatusChecker,
    useDaCoinzCollector
} from './composables';
import template from './template.html?raw';

export class ExtensionContainer extends BasicView {
    constructor() {
        super(template);

        useDebugMode();
        useDelayRemover();
        useDaCoinzCollector();

        useStreamStatusChecker({ el: this.el });
        useChestGameService({ el: this.el });
        useLootGameService({ el: this.el });
        useHitsquadService({ el: this.el });

        // useAkiraDrawingService({ el: this.el });
    }
}

// <span class="mention-fragment mention-fragment--recipient" data-a-target="chat-message-mention"></span>
// <div class="chat-line__message" data-a-target="chat-line-message" data-a-user="hitsquadgodfather" tabindex="0"
