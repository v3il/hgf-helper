import 'reflect-metadata';
import { GlobalSettingsService } from '@components/settings';
import { Container } from 'typedi';
import { StreamElementsUIService, OffersFacade } from '@store/modules';
import { OffersList } from './views';
import './store.css';

export const start = async () => {
    const globalSettings = Container.get(GlobalSettingsService);
    const streamElementsUIService = Container.get(StreamElementsUIService);
    const offersFacade = Container.get(OffersFacade);

    await globalSettings.loadSettings();
    streamElementsUIService.enhanceStorePage();

    streamElementsUIService.whenOffersLoaded(async () => {
        console.clear();

        await streamElementsUIService.sortOffers();

        await offersFacade.fetchHiddenOffers()
            .catch((error) => {
                console.error(error);
                alert('Failed to fetch hidden offers. Please check your JSONBin credentials in the settings popup.');
            });

        new OffersList(streamElementsUIService.offersListEl);
    });
};
