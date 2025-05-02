<script lang="ts">
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import { StreamElementsUIService } from '@store/modules';
import Auth from './Auth.svelte'
import { HiddenOffersManager } from './hiddenOffersManager'
import { OffersList } from './offersList'
import { mount, unmount } from 'svelte';

const authFacade = Container.get(AuthFacade);
const streamElementsUIService = Container.get(StreamElementsUIService);

let authView: any;
const authEl = document.createElement('div');

let hiddenOffersManager: any;
const hiddenOffersManagerEl = document.createElement('div');

let offersList: any;

if (authFacade.isAuthenticated) {
    renderOfferViews();
} else {
    renderAuthView();
}

authFacade.onAuthenticated(() => {
    renderOfferViews();
    unmount(authView);
});

authFacade.onLogout(() => {
    renderAuthView();
    unmount(hiddenOffersManager);
    unmount(offersList);
});

function renderAuthView() {
    streamElementsUIService.onLayoutRendered(() => {
        streamElementsUIService.pageContentEl!.insertAdjacentElement('afterbegin', authEl);

        authView = mount(Auth, {
            target: authEl
        });
    });
}

function renderOfferViews() {
    streamElementsUIService.enhanceStorePage();

    streamElementsUIService.whenOffersLoaded(async () => {
        streamElementsUIService.userStatsEl.insertAdjacentElement('beforebegin', hiddenOffersManagerEl);

        hiddenOffersManager = mount(HiddenOffersManager, {
            target: hiddenOffersManagerEl
        });

        offersList = mount(OffersList, {
            target: streamElementsUIService.offersListEl
        });

        await streamElementsUIService.sortOffers();
    });
}
</script>
