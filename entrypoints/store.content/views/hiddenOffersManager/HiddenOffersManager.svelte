<div>
    <button
        class="flex items-center justify-center px-[24px] py-[12px] w-full font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md bg-[#9146FF] hover:bg-[#7c31ff] text-white text-[14px]"
        onclick={() => { isDialogOpened = true; }}
    >
        <ChartNoAxesGantt size="18" class="mr-[8px]" />
        Manage hidden offers
    </button>

    <HiddenOffersManagerDialog isOpened={isDialogOpened} onclose={() => { isDialogOpened = false; }} />
</div>

<script lang="ts">
import HiddenOffersManagerDialog from './HiddenOffersManagerDialog.svelte';
import { ChartNoAxesGantt } from '@lucide/svelte';

let isDialogOpened = $state(false);1
</script>
