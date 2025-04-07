import './style.css';
import { BasicView } from '@shared/views';
import {
    useChestGameService,
    useDebugMode,
    useDelayRemover,
    useHitsquadService,
    useLootGameService,
    useStreamStatusChecker,
    useDaCoinzCollector,
    useMentionsHighlighter,
    IDebugMode,
    IDelayRemover,
    IDaCoinzCollector,
    IMentionsHighlighter,
    IStreamStatusChecker,
    IChestGameService,
    ILootGameService,
    IHitsquadService
} from './composables';
import template from './template.html?raw';

export class ExtensionContainer extends BasicView {
    private debugMode!: IDebugMode;
    private delayRemover!: IDelayRemover;
    private daCoinzCollector!: IDaCoinzCollector;
    private mentionsHighlighter!: IMentionsHighlighter;
    private streamStatusChecker!: IStreamStatusChecker;
    private chestGameService!: IChestGameService;
    private lootGameService!: ILootGameService;
    private hitsquadService!: IHitsquadService;

    constructor() {
        super(template);
        this.render();
    }

    render() {
        this.debugMode = useDebugMode();
        this.delayRemover = useDelayRemover();
        this.daCoinzCollector = useDaCoinzCollector();
        this.mentionsHighlighter = useMentionsHighlighter();
        this.streamStatusChecker = useStreamStatusChecker({ el: this.el });
        this.chestGameService = useChestGameService({ el: this.el });
        this.lootGameService = useLootGameService({ el: this.el });
        this.hitsquadService = useHitsquadService({ el: this.el });

        document.body.appendChild(this.el);
    }

    destroy() {
        this.debugMode.destroy();
        this.delayRemover.destroy();
        this.daCoinzCollector.destroy();
        this.mentionsHighlighter.destroy();
        this.streamStatusChecker.destroy();
        this.chestGameService.destroy();
        this.lootGameService.destroy();
        this.hitsquadService.destroy();

        super.destroy();
    }
}
