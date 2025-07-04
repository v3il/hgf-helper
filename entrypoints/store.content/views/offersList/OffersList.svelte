<script lang="ts">
import { Container } from 'typedi';
import { OffersFacade, StreamElementsUIService } from '@store/modules';
import OffersListItem from './OffersListItem.svelte';
import { mount, onDestroy, unmount } from 'svelte';

const offersFacade = Container.get(OffersFacade);
const streamElementsUIService = Container.get(StreamElementsUIService);

let children: OffersListItem[] = [];

streamElementsUIService.whenOffersLoaded(async () => {
    await streamElementsUIService.sortOffers();

    children = Array.from(streamElementsUIService.offerEls).map((offerEl) => {
        const nameEl = offerEl.querySelector<HTMLElement>('h6');

        if (!nameEl) {
            return null;
        }

        const name = nameEl!.textContent!.trim().toLowerCase();
        const description = offerEl.querySelector('p span[data-state="closed"]')!.textContent!.trim();

        const infoParagraphs = Array.from(
            offerEl.querySelectorAll<HTMLElement>('p')).filter(p => p.querySelector('span.material-icons')
        );

        let count = '';
        let price = '';

        infoParagraphs.forEach(p => {
            const icon = p.querySelector<HTMLElement>('span.material-icons')!.textContent!.trim() ?? '';
            const text = p.textContent!.replace(icon, '').trim().toLowerCase();

            if (icon === 'shopping_basket') count = text;
            if (icon === 'monetization_on') price = text;
        });

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
    }).filter((child) => child !== null);
});

onDestroy(() => {
    children.forEach((child) => {
        unmount(child);
    });
});
</script>
