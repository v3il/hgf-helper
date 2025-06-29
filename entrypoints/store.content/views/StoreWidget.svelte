<HiddenOffersManager />
<OffersList />

<script lang="ts">
import { Container } from 'typedi';
import { StreamElementsUIService } from '@store/modules';
import { HiddenOffersManager } from './hiddenOffersManager'
import { OffersList } from './offersList'
import { onDestroy } from 'svelte';
import { watchClassOnElement } from '@utils';

const streamElementsUIService = Container.get(StreamElementsUIService);

streamElementsUIService.enhanceStorePage();

watchClassOnElement(document.body, 'dark-theme', (isDark) => {
    document.body.classList.toggle('dark', isDark);
});

onDestroy(() => {
    streamElementsUIService.removeStorePageEnhancements();
})
</script>
