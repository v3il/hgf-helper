<dialog class="hgf-hidden-offers-manager__dialog" bind:this={dialogRef}>
    <div class="hgf-hidden-offers-manager__dialog-content">
        <h3 class="hgf-mb-16 hgf-color-white">Manage hidden offers</h3>

        <input type="text" placeholder="Search..." class="uk-input hgf-mb-16" bind:value={query} bind:this={inputRef} />

        {#if displayedOffers.length > 0}
            <HiddenOffersManagerTable offers={displayedOffers} onOfferRemove={onOfferRemove} />
        {:else}
            <HiddenOffersManagerEmpty message={query ? 'No offers found' : 'No hidden offers'} />
        {/if}
    </div>

    <div class="uk-flex uk-flex-right">
        <button class="uk-button uk-button-primary" onclick={handleDialogClose}>
            Close
        </button>
    </div>
</dialog>

<script lang="ts">
import HiddenOffersManagerTable from './HiddenOffersManagerTable.svelte';
import HiddenOffersManagerEmpty from './HiddenOffersManagerEmpty.svelte';
import { OffersFacade } from '@store/modules';
import { Container } from 'typedi';

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

})

const displayedOffers = $derived.by(() => {
    return offersFacade.hiddenOffers.toReversed().filter((offer) => offer.includes(query));
});

function handleDialogClose() {
    onclose();
    query = '';
}

async function onOfferRemove(offer: string) {
    if (!window.confirm(`Are you sure you want to unhide the "${offer}" offer?`)) {
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
.hgf-hidden-offers-manager__dialog[open] {
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

.hgf-hidden-offers-manager__dialog-content {
    flex: 1;
    overflow-y: auto;
}

.hgf-hidden-offers-manager__dialog::backdrop {
    background-color: #121212;
    opacity: 0.85;
}
</style>
