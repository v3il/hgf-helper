import { isDev } from '../../../consts';

export class TwitchChatService {
    static create() {
        return new TwitchChatService();
    }

    sendMessage(message, forced = false) {
        const detail = { message, forced, isDev };
        const event = new CustomEvent('hgf-helper:sendMessage', { detail });

        window.dispatchEvent(event);
    }
}
