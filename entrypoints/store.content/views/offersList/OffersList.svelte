<script lang="ts">
import { Container } from 'typedi';
import { OffersFacade, StreamElementsUIService } from '@store/modules';
import OffersListItem from './OffersListItem.svelte';
import { mount, onDestroy, unmount } from 'svelte';
import { SettingsFacade } from '@shared/modules';

const offersFacade = Container.get(OffersFacade);
const settingsFacade = Container.get(SettingsFacade);
const streamElementsUIService = Container.get(StreamElementsUIService);

const offerViews = Array.from(streamElementsUIService.offersListEl.querySelectorAll<HTMLElement>('.stream-store-list-item'));

const children = offerViews.map((offerEl) => {
    const gameNameEl = offerEl.querySelector<HTMLHeadingElement>('.item-title')!;
    const countEl = offerEl.querySelector<HTMLSpanElement>('.item-quantity-left span')!;
    const itemCostEl = offerEl.querySelector<HTMLParagraphElement>('.item-cost')!;
    const descriptionEl = offerEl.querySelector<HTMLParagraphElement>('.clamp-description-text')!;

    const name = gameNameEl.getAttribute('title')!.toLowerCase().trim();
    const count = countEl.textContent!.toLowerCase().trim();
    const price = itemCostEl.lastChild!.textContent!.trim();
    const description = descriptionEl.textContent!.toLowerCase().trim();

    const offer = offersFacade.createOffer({
        name,
        count,
        price,
        description
    });

    return mount(OffersListItem, {
        target: offerEl,
        props: {
            offer,
            offerEl
        }
    });
});

function toggleOffersVisibility() {
    children.forEach((child) => {
        child.toggleOfferVisibility();
    })
}

function toggleVolumeIndicator() {
    children.forEach((child) => {
        child.toggleVolumeIndicator();
    })
}

offersFacade.events.on('offer-shown', toggleOffersVisibility);
settingsFacade.onSettingChanged('hideSoldOutOffers', toggleOffersVisibility);
settingsFacade.onSettingChanged('offersMaxPrice', toggleOffersVisibility);
settingsFacade.onSettingChanged('highlightLowVolumeOffers', toggleVolumeIndicator);

onDestroy(() => {
    children.forEach((child) => {
        unmount(child);
    })
})
</script>;
