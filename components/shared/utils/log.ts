import { SettingsFacade } from '@components/shared';

export const log = (message: any) => {
    if (SettingsFacade.instance.globalSettings.enableLogs) {
        const time = new Date().toLocaleTimeString();
        console.log(`HGF Helper, ${time}:`, message);
    }
};
