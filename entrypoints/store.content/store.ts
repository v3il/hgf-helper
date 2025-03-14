import 'reflect-metadata';
import { GlobalSettingsService } from '@components/settings';
import { Container } from 'typedi';
// @ts-ignore
import { StreamElementsFacade } from './modules/streamElements';
// @ts-ignore
import { OffersFacade } from './modules/offers';
// @ts-ignore
import { OffersList } from './views/offer/OffersList';

export const start = () => {
    const globalSettings = Container.get(GlobalSettingsService);

    StreamElementsFacade.instance.init(async () => {
        console.clear();

        await globalSettings.loadSettings();
        await StreamElementsFacade.instance.sortOffersByCost();
        await OffersFacade.instance.fetchHiddenOffers();

        new OffersList({
            el: StreamElementsFacade.instance.offersListEl,
            offersFacade: OffersFacade.instance
        });
    });
};
