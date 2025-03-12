import './style.css';
import { BasicView } from '@components/shared';
import {
    useChestGameRunner,
    useDebugMode,
    useDelayRemover,
    useHitsquadRunner,
    useLootGameRunner,
    useStreamStatusChecker
} from './composables';
import template from './template.html?raw';

export class ExtensionContainer extends BasicView {
    constructor() {
        super(template);

        useDebugMode();
        useDelayRemover();
        useStreamStatusChecker({ el: this.el });
        useChestGameRunner({ el: this.el });
        useLootGameRunner({ el: this.el });
        useHitsquadRunner({ el: this.el });

        // useAkiraDrawingRunner({ el: this.el });
    }
}
