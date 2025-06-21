<dialog class="hgf-dialog" bind:this={dialogRef}>
    <h3 class="mb-[16px] text-white">Manage hidden offers</h3>

    <input
        class="w-full rounded-md border px-[16px] py-[8px] mb-[16px] outline-0 text-base ring-offset-background bg-[#27272a] border-[#3f3f46] text-[#d4d4d8] placeholder:text-[#71717a]"
        placeholder="Search..."
        bind:value={query}
        bind:this={inputRef}
    >

    <div class="grow overflow-auto h-[500px]">
        {#if displayedOffers.length > 0}
            <HiddenOffersManagerTable offers={displayedOffers} onOfferRemove={onOfferRemove} />
        {:else}
            <HiddenOffersManagerEmpty message={query ? 'No offers found' : 'No hidden offers'} />
        {/if}
    </div>

    <div class="flex grow-0">
        <button
            class="ml-auto mt-[8px] whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-[#d4d4d8]"
            onclick={handleDialogClose}
        >
            Close
        </button>
    </div>
</dialog>

<script lang="ts">
import HiddenOffersManagerTable from './HiddenOffersManagerTable.svelte';
import HiddenOffersManagerEmpty from './HiddenOffersManagerEmpty.svelte';
import { OffersFacade } from '@store/modules';
import { Container } from 'typedi';
import { capitalize } from '@utils';

interface Props {
    isOpened: boolean;
    onclose: () => void;
}

const { isOpened, onclose }: Props = $props();

const offersFacade = Container.get(OffersFacade);

let dialogRef: HTMLDialogElement | null = null;
let inputRef: HTMLInputElement | null = null;

let query = $state('');

$effect(() => {
    if (isOpened) {
        inputRef?.focus();
    }

    isOpened ? dialogRef?.showModal() : dialogRef?.close();
});

const displayedOffers = $derived.by(() => {
    return offersFacade.hiddenOffers.toReversed().filter((offer) => offer.includes(query));
});

function handleDialogClose() {
    onclose();
    query = '';
}

async function onOfferRemove(offer: string) {
    if (!window.confirm(`Are you sure you want to unhide the "${capitalize(offer)}" offer?`)) {
        return;
    }

    try {
        await offersFacade.unhideOffer(offer);
    } catch (error) {
        alert('Failed to hide offer');
        console.error(error);
    }
}
</script>

<style>
.hgf-dialog[open] {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    min-height: 500px;
    border-radius: 8px;
    letter-spacing: 0;
    background-color: #131315;
    border: 2px solid gray;
    padding: 16px;
    display: flex;
    flex-direction: column;
}

.hgf-dialog::backdrop {
    background-color: #121212;
    opacity: 0.85;
}
</style>
