<div class="mb-[16px]">
    <button
        class="p-[16px] w-full font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md bg-[#9146FF] hover:bg-[#7c31ff] text-white text-[14px]"
        onclick={() => { isDialogOpened = true; }}
    >
        Manage hidden offers
    </button>

    <HiddenOffersManagerDialog isOpened={isDialogOpened} onclose={() => { isDialogOpened = false; }} />
</div>

<script lang="ts">
import HiddenOffersManagerDialog from './HiddenOffersManagerDialog.svelte';

let isDialogOpened = $state(false);
</script>
