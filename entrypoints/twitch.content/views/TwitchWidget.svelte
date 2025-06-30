<div class="flex justify-between items-center py-[10px] px-[16px] w-full rounded-xl">
    <MiniGamesControls />
    <StreamStatus />
</div>

<script lang="ts">
import { StreamStatus } from './streamStatus';
import { useDaCoinzCollector, useMentionsHighlighter, useDelayRemover } from './composables';
import { MiniGamesControls } from './miniGames';

useDelayRemover();
useDaCoinzCollector();
useMentionsHighlighter();
</script>
