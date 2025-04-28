<div class="flex flex-col w-full">
    <div class="bg-[#18181b]/80 backdrop-blur-sm shadow-lg p-[16px] space-x-4 flex items-center justify-between border border-[#27272a] rounded-t-xl">
        <h2 class="font-semibold text-[#d4d4d8] text-[16px] leading-[1.45]">HGF-Helper</h2>
        <StreamStatus />
    </div>

    <div class="bg-[#18181b]/80 backdrop-blur-sm border-x border-[#27272a]">
        <HitsquadControls />
<!--        <LootControls />-->
<!--        <ChestControls />-->
    </div>
</div>

<script>
import HitsquadControls from './HitsquadControls.svelte';
import LootControls from './LootControls.svelte';
import ChestControls from './ChestControls.svelte';
import StreamStatus from './StreamStatus.svelte';
import { useDaCoinzCollector, useMentionsHighlighter, useDelayRemover } from '../composables';
import { Logo } from '@shared/components';

useDelayRemover();
useDaCoinzCollector();
useMentionsHighlighter();
</script>
