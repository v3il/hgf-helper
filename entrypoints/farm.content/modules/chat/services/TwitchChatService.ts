import { isDev } from '@farm/consts';

export class TwitchChatService {
    private isSuppressed = isDev;

    sendMessage(message: string, forced = false) {
        const detail = { message, forced, isDev: this.isSuppressed };
        const event = new CustomEvent('hgf-helper:sendMessage', { detail });

        window.dispatchEvent(event);
    }

    async withoutSuppression(cb: () => Promise<void>) {
        this.isSuppressed = false;
        await cb();
        this.isSuppressed = isDev;
    }
}
