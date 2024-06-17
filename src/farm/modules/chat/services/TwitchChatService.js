import { isDev } from '../../../consts';

export class TwitchChatService {
    sendMessage(message, forced = false) {
        const detail = { message, forced, isDev };
        const event = new CustomEvent('hgf-helper:sendMessage', { detail });

        console.info('Sending message:', message, 'Forced:', forced, 'isDev:', isDev);

        window.dispatchEvent(event);
    }
}
