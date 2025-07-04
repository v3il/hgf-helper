import { Service } from 'typedi';
import { ISettings } from '@shared/modules/types';
import { merge } from 'lodash';
import { EventEmitter, EventHandler } from '@shared/EventEmitter';
import { getObjectDiff } from '@utils';

const STORAGE_KEY = 'hgf-helper.data_v2';

interface IStorageData {
    token?: string;
    settings?: ISettings;
}

interface IStorageDataRecord {
    [STORAGE_KEY]: IStorageData;
}

@Service()
export class StorageService {
    private readonly storage = chrome.storage.local;
    private readonly storageKey = 'hgf-helper.data_v2';

    private storageData!: IStorageData;

    private events = EventEmitter.create<{
        change: Partial<IStorageData>;
    }>()

    constructor() {
        this.initObserver();
    }

    async getAuthToken(): Promise<string> {
        this.storageData ??= await this.loadStorageData();
        return this.storageData.token || '';
    }

    async updateData(data: Partial<IStorageData>): Promise<void> {
        this.storageData ??= await this.loadStorageData();

        const updatedData = merge(this.storageData, data);
        await this.storage.set({ [this.storageKey]: updatedData });
    }

    onDataChanged(handler: EventHandler<Partial<IStorageData>>) {
        return this.events.on('change', handler);
    }

    private async loadStorageData() {
        const data = await this.storage.get<IStorageDataRecord>([this.storageKey]);

        return data[this.storageKey] || {};
    }

    private initObserver() {
        this.storage.onChanged.addListener((changes) => {
            if (!changes[this.storageKey]) return;

            const changedData: IStorageData = changes[this.storageKey].newValue;
            const diff = getObjectDiff(this.storageData, changedData);

            this.storageData = merge(this.storageData, changedData);
            this.events.emit('change', diff);
        });
    }
}
