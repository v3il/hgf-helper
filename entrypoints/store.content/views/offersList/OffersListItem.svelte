<div
    class="absolute left-0 right-0 top-0 p-[8px] bg-white dark:bg-[#121212] flex items-center justify-between border-[3px] border-[#555] [&.low]:border-[indianred]"
    class:low={isLowVolumeHighlighted}
>
    <a href={offer.steamAppLink} class="text-[12px] text-gray-800 dark:text-[#d4d4d8] font-bold hover:underline" target="_blank" rel="noreferrer">
        Steam
    </a>

    <button
        onclick={hideOfferHandler}
        class="text-[12px] font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border bg-background h-[24px] rounded-md px-[8px] text-gray-800 dark:text-[#d4d4d8] border-[#27272a] hover:opacity-80"
    >
        Hide
    </button>
</div>

<script lang="ts">
import { Offer } from '@store/modules/offers/models';
import { Container } from 'typedi';
import { OffersFacade } from '@store/modules';
import { SettingsFacade } from '@shared/modules';
import { onDestroy } from 'svelte';

interface Props {
    offer: Offer;
    offerEl: HTMLElement;
}

const { offer, offerEl }: Props = $props();

const offersFacade = Container.get(OffersFacade);
const settingsFacade = Container.get(SettingsFacade);

const isOfferHidden = $derived.by(() => {
    const { offersMaxPrice, hideSoldOutOffers } = settingsFacade.settings;

    if (hideSoldOutOffers && offer.isSoldOut) {
        return true;
    }

    return offer.price > offersMaxPrice || offersFacade.isOfferHidden(offer);
});

const isLowVolumeHighlighted = $derived.by(() => offer.isLowVolume && settingsFacade.settings.highlightLowVolumeOffers);

$effect(() => {
    offerEl.classList.toggle('hidden', isOfferHidden);
});

async function hideOfferHandler() {
    if (!window.confirm(`Are you sure you want to hide the "${offer.name}" offer?`)) {
        return;
    }

    try {
        await offersFacade.hideOffer(offer);
    } catch (error) {
        alert('Failed to hide offer');
        console.error(error);
    }
}

onDestroy(() => {
    offerEl.classList.remove('hidden');
});
</script>
