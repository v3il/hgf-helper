import './style.css';
import { BasicView } from '@components/BasicView';
import {
    useChestGameService,
    useDebugMode,
    useDelayRemover,
    useHitsquadService,
    useLootGameService,
    useStreamStatusChecker,
    useDaCoinzCollector,
    useMentionsHighlighter
} from './composables';
import template from './template.html?raw';

export class ExtensionContainer extends BasicView {
    constructor() {
        super(template);

        useDebugMode();
        useDelayRemover();
        useDaCoinzCollector();
        useMentionsHighlighter();

        useStreamStatusChecker({ el: this.el });
        useChestGameService({ el: this.el });
        useLootGameService({ el: this.el });
        useHitsquadService({ el: this.el });

        // useAkiraDrawingService({ el: this.el });
    }
}
