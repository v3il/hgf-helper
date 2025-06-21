<script lang="ts">
import { Container } from 'typedi';
import { OffersFacade, StreamElementsUIService } from '@store/modules';
import OffersListItem from './OffersListItem.svelte';
import { mount, onDestroy, unmount } from 'svelte';
import { HiddenOffersManager } from '@store/views/hiddenOffersManager';
import { OffersList } from '@store/views/offersList/index';

const offersFacade = Container.get(OffersFacade);
const streamElementsUIService = Container.get(StreamElementsUIService);

let children: OffersListItem[] = [];

streamElementsUIService.whenOffersLoaded(async () => {
    await streamElementsUIService.sortOffers();

    const offerViews = Array.from(streamElementsUIService.offersListEl.querySelectorAll<HTMLElement>('.stream-store-list-item'));

    children = offerViews.map((offerEl) => {
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
});

onDestroy(() => {
    children.forEach((child) => {
        unmount(child);
    })
})
</script>
