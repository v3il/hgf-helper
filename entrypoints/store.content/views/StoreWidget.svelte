<HiddenOffersManager />
<OffersList />

<script lang="ts">
import { Container } from 'typedi';
import { StreamElementsUIService } from '@store/modules';
import { HiddenOffersManager } from './hiddenOffersManager'
import { OffersList } from './offersList'
import { onDestroy } from 'svelte';

const streamElementsUIService = Container.get(StreamElementsUIService);

streamElementsUIService.enhanceStorePage();

onDestroy(() => {
    streamElementsUIService.removeStorePageEnhancements();
})
</script>
