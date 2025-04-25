<HitsquadControls />
<MiniGamesSeparator />
<LootControls />
<MiniGamesSeparator />
<ChestControls />

<script>
import HitsquadControls from './HitsquadControls.svelte';
import LootControls from './LootControls.svelte';
import ChestControls from './ChestControls.svelte';
import { MiniGamesSeparator } from './basicComponents';
import { useDaCoinzCollector, useMentionsHighlighter, useDelayRemover } from '../composables';

useDelayRemover();
useDaCoinzCollector();
useMentionsHighlighter();
</script>
