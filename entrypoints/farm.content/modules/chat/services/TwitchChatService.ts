import { isDev } from '@farm/consts';

export class TwitchChatService {
    sendMessage(message: string) {
        console.error('HGF-Helper: send', message);

        if (isDev) return;

        const detail = { message };
        const event = new CustomEvent('hgf-helper:sendMessage', { detail });

        window.dispatchEvent(event);
    }
}
