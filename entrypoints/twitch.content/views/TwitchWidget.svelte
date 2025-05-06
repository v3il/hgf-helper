<div class="flex justify-between p-[12px] w-full rounded-xl border border-gray-200 dark:border-[#27272a] bg-white/90 dark:bg-[#18181b]/80">
    <CompactMiniGamesControls />
    <StreamStatus />
</div>

<script lang="ts">
import { StreamStatus } from './streamStatus';
import { useDaCoinzCollector, useMentionsHighlighter, useDelayRemover } from './composables';
import { CompactMiniGamesControls } from './miniGames';
import { ChestGameService, HitsquadGameService, LootGameService } from '@twitch/modules/miniGames';
import { onDestroy } from 'svelte';
import { Container } from 'typedi';
import { AntiCheatProcessor, OffscreenStreamRenderer } from '@twitch/modules/stream';

const offscreenStreamRenderer = Container.get(OffscreenStreamRenderer);
const antiCheatProcessor = Container.get(AntiCheatProcessor);

const hitsquadGameService = new HitsquadGameService();
const lootGameService = new LootGameService();
const chestGameService = new ChestGameService();

antiCheatProcessor.start();

setContext('hitsquad', hitsquadGameService);
setContext('loot', lootGameService);
setContext('chest', chestGameService);

useDelayRemover();
useDaCoinzCollector();
useMentionsHighlighter();

onDestroy(() => {
    offscreenStreamRenderer.destroy();
    antiCheatProcessor.destroy();
    hitsquadGameService.destroy();
    lootGameService.destroy();
    chestGameService.destroy();
});
</script>
