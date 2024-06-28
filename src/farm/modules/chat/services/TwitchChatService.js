import { isDev } from '@/farm/consts';

export class TwitchChatService {
    sendMessage(message, forced = false) {
        const detail = { message, forced, isDev };
        const event = new CustomEvent('hgf-helper:sendMessage', { detail });

        window.dispatchEvent(event);
    }
}
