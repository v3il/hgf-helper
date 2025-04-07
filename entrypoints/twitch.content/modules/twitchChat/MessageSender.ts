import { isDev, Timing } from '@shared/consts';
import { log } from '@utils';
import { Service } from 'typedi';

@Service()
export class MessageSender {
    private readonly messageQueue: string[] = [];

    constructor() {
        this.initQueue();
    }

    sendMessage(message: string) {
        this.messageQueue.push(message);
    }

    private initQueue() {
        setInterval(() => {
            if (this.messageQueue.length) {
                this.dispatchMessage(this.messageQueue.shift()!);
            }
        }, 2 * Timing.SECOND);
    }

    private dispatchMessage(message: string) {
        log(`Send ${message}`);

        if (isDev) return;

        const detail = { message };
        const event = new CustomEvent('hgf-helper:sendMessage', { detail });

        window.dispatchEvent(event);
    }
}
