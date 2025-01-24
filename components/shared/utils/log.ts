import { SettingsFacade } from '@components/shared';

export const log = (message: string) => {
    if (SettingsFacade.instance.getGlobalSetting('enableLogs')) {
        const time = new Date().toLocaleTimeString();
        console.log(`HGF Helper, ${time}:`, message);
    }
};
