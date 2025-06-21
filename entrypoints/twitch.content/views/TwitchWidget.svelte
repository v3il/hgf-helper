<div class="flex justify-between items-center py-[10px] px-[16px] w-full rounded-xl">
    <MiniGamesControls />
    <StreamStatus />
</div>

<script lang="ts">
import { StreamStatus } from './streamStatus';
import { useDaCoinzCollector, useMentionsHighlighter, useDelayRemover } from './composables';
import { MiniGamesControls } from './miniGames';
import { ChestGameService, HitsquadGameService, LootGameService } from '@twitch/modules/miniGames';
import { onDestroy } from 'svelte';
import { Container } from 'typedi';
import { OffscreenStreamRenderer } from '@twitch/modules/stream';

const offscreenStreamRenderer = Container.get(OffscreenStreamRenderer);

const hitsquadGameService = new HitsquadGameService();
const lootGameService = new LootGameService();
const chestGameService = new ChestGameService();

setContext('hitsquad', hitsquadGameService);
setContext('loot', lootGameService);
setContext('chest', chestGameService);

useDelayRemover();
useDaCoinzCollector();
useMentionsHighlighter();

onDestroy(() => {
    offscreenStreamRenderer.destroy();
    hitsquadGameService.destroy();
    lootGameService.destroy();
    chestGameService.destroy();
});
</script>
