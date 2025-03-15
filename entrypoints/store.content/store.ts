import 'reflect-metadata';
import { GlobalSettingsService } from '@components/settings';
import { Container } from 'typedi';
import { StreamElementsUIService, OffersFacade } from '@store/modules';
import { OffersList } from './views';

export const start = () => {
    const globalSettings = Container.get(GlobalSettingsService);
    const streamElementsUIService = Container.get(StreamElementsUIService);
    const offersFacade = Container.get(OffersFacade);

    streamElementsUIService.whenOffersLoaded(async () => {
        console.clear();

        await globalSettings.loadSettings();

        await offersFacade.fetchHiddenOffers()
            .catch((error) => {
                console.error(error);
                alert('Failed to fetch hidden offers. Please check your JSONBin credentials in the settings popup.');
            });

        new OffersList(streamElementsUIService.offersListEl);
    });
};
