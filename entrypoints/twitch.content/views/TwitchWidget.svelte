<div class="flex flex-col w-full rounded-xl border border-[#27272a]">
    <div class={headerClasses}>
        {#if isExpanded}
            <h2 class="font-semibold text-[#d4d4d8] text-[16px] leading-[1.45]">HGF-Helper</h2>
        {:else}
            <CompactMiniGamesControls />
        {/if}

        <div class="flex items-center gap-[24px] ml-[16px]">
            <StreamStatus />

            <button
                onclick={togglePanel}
                class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-[40px] w-[40px] uppercase text-[#a1a1aa] bg-[#27272a]/20 hover:bg-[#27272a]/50 hover:text-[#d4d4d8]"
            >
                {#if isExpanded}
                    <ChevronUp size="20" class="text-[#9b87f5]" />
                {:else}
                    <ChevronDown size="20" class="text-[#9b87f5]" />
                {/if}
            </button>
        </div>
    </div>

    {#if isExpanded}
        <div class="bg-[#18181b]/80 backdrop-blur-sm rounded-b-[inherit]">
            <HitsquadControls class="border-b border-[#27272a]" />
            <LootControls class="border-b border-[#27272a]" />
            <ChestControls class="rounded-b-[inherit]" />
        </div>
    {/if}
</div>

<script lang="ts">
import { StreamStatus } from './streamStatus';
import { useDaCoinzCollector, useMentionsHighlighter, useDelayRemover } from './composables';
import { HitsquadControls, ChestControls, LootControls, CompactMiniGamesControls } from './miniGames';
import { ChevronDown, ChevronUp } from '@lucide/svelte';
import clsx from 'clsx';
import { ChestGameService, HitsquadGameService, LootGameService } from '@twitch/modules/miniGames';
import { onDestroy } from 'svelte';

const hitsquadGameService = new HitsquadGameService();
const lootGameService = new LootGameService();
const chestGameService = new ChestGameService();

setContext('hitsquad', hitsquadGameService);
setContext('loot', lootGameService);
setContext('chest', chestGameService);

let isExpanded = $state(!true);

const headerClasses = $derived(
    clsx([
        'bg-[#18181b]/80 backdrop-blur-sm shadow-lg px-[16px] py-[8px] space-x-4 flex items-center justify-between rounded-t-[inherit]',
        {
            'border-b border-[#27272a]': isExpanded,
            'rounded-b-[inherit]': !isExpanded
        }
    ])
);

useDelayRemover();
useDaCoinzCollector();
useMentionsHighlighter();

function togglePanel() {
    isExpanded = !isExpanded;
}

onDestroy(() => {
    hitsquadGameService.destroy();
    lootGameService.destroy();
    chestGameService.destroy();
});
</script>
