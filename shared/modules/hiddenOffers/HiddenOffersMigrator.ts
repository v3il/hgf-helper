import { ContainerInstance, Service } from 'typedi';
import { HiddenOffersService } from './HiddenOffersService.svelte';
import { RequestSender } from '@shared/modules/RequestSender';
import { logError } from '@utils';

export interface IMigrateOffersParams {
    jsonBinUrl: string;
    jsonBinAccessKey: string;
}

@Service()
export class HiddenOffersMigrator {
    private readonly hiddenOffersService: HiddenOffersService;
    private readonly requestSender: RequestSender;

    constructor(container: ContainerInstance) {
        this.hiddenOffersService = container.get(HiddenOffersService);
        this.requestSender = container.get(RequestSender);
    }

    async migrate(params: IMigrateOffersParams) {
        const { jsonBinUrl, jsonBinAccessKey } = params;

        const response = await this.requestSender.sendRequest<{ record: { offers: string[] } }>(jsonBinUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': jsonBinAccessKey
            }
        });

        if (response.error) {
            logError('Error fetching hidden offers:', response.error);
            return 0;
        }

        const offers = response.data!.record.offers ?? [];

        return await this.hiddenOffersService.mergeHiddenOffers(offers);
    }
}
