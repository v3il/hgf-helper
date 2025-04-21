<div class={classes}>
    <a href={offer.steamAppLink} class="hgf-container__steam" target="_blank" rel="noreferrer">Steam</a>
    <button class="hgf-container__hide" onclick={hideOfferHandler}>Hide</button>
</div>

<script lang="ts">
import { Offer } from '@store/modules/offers/models';
import { Container } from 'typedi';
import { OffersFacade } from '@store/modules';
import { SettingsFacade } from '@shared/modules';
import clsx from 'clsx';

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

const classes = $derived(
    clsx({
        'hgf-container': true,
        'hgf-container--low-volume': isLowVolumeHighlighted,
    })
)

$effect(() => {
    offerEl.classList.toggle('hgf-hidden', isOfferHidden);
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
</script>;

<style>
.hgf-container {
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    padding: 8px;
    background-color: #121212;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 3px solid #555;
}

.hgf-container--low-volume {
    border-color: indianred;
}

.hgf-container__hide {
    font-size: 12px;
    display: block;
}

.hgf-container__steam {
    font-size: 12px;
    display: block;
    color: #ccc;
    font-weight: bold;
}

.hgf-container__steam:hover {
    text-decoration: underline;
}
</style>
