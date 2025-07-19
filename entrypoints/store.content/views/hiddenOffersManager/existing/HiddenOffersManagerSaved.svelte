<div class="flex flex-col h-full">
    <input
        class="w-full rounded-md border shrink-0 px-[16px] py-[8px] mb-[16px] outline-0 text-base ring-offset-background bg-[#27272a] border-[#3f3f46] text-[#d4d4d8] placeholder:text-[#71717a]"
        placeholder="Search..."
        bind:value={query}
        bind:this={inputRef}
    >

    <div class="grow overflow-auto">
        {#if displayedOffers.length > 0}
            <HiddenOffersManagerTable offers={displayedOffers} onOfferRemove={onOfferRemove} />
        {:else}
            <HiddenOffersManagerEmpty message={query ? 'No offers found' : 'No hidden offers'} />
        {/if}
    </div>
</div>

<script lang="ts">
import { Container } from 'typedi';
import { OffersFacade } from '@store/modules';
import HiddenOffersManagerTable from './HiddenOffersManagerTable.svelte';
import HiddenOffersManagerEmpty from './HiddenOffersManagerEmpty.svelte';
import { onMount } from 'svelte';
import { logError } from '@utils';

const offersFacade = Container.get(OffersFacade);

let inputRef: HTMLInputElement | null = null;

let query = $state('');

onMount(() => {
    inputRef?.focus();
});

const displayedOffers = $derived.by(() => {
    return offersFacade.hiddenOffers.toReversed().filter((offer) => offer.includes(query));
});

async function onOfferRemove(offer: string) {
    if (!window.confirm(`Are you sure you want to unhide the "${capitalize(offer)}" offer?`)) {
        return;
    }

    try {
        await offersFacade.unhideOffer(offer);
    } catch (error) {
        alert('Failed to hide offer');
        logError(error);
    }
}
</script>
