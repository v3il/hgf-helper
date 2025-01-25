import { isDev } from '@farm/consts';

export class TwitchChatService {
    private isSuppressed = isDev;

    sendMessage(message: string) {
        const detail = { message, suppressed: this.isSuppressed };
        const event = new CustomEvent('hgf-helper:sendMessage', { detail });

        window.dispatchEvent(event);
    }

    async withoutSuppression(cb: () => void | Promise<void>) {
        this.isSuppressed = false;
        await cb();
        this.isSuppressed = isDev;
    }
}
