import { EventEmitter } from '@shared/EventEmitter';
import { Timing } from '@shared/consts';
import { Container, Service } from 'typedi';
import { TwitchUIService } from '@twitch/modules';

export interface IChatMessage {
    messageWrapperEl: HTMLElement;
    userName: string;
    message: string;
    isSystemMessage: boolean;
    isReward: boolean;
    isAkiraDrawReward: boolean;
    hasMyMention: boolean;
}

function isRewardMessage(message: string) {
    return /has been sent \d+ clams!/.test(message);
}

function isAkiraDrawRewardMessage(message: string) {
    return /\w Just Won \d+ Clams From Akiras Drawing/i.test(message);
}

@Service()
export class ChatObserver {
    private readonly twitchUIService!: TwitchUIService;

    readonly events;
    private observer;

    constructor() {
        this.twitchUIService = Container.get(TwitchUIService);

        this.events = EventEmitter.create<{
            message: IChatMessage;
        }>();

        this.observer = this.#createObserver();

        // Skip initial messages
        // todo: find a better way
        setTimeout(() => {
            this.observer.observe(this.twitchUIService.chatScrollableAreaEl!, { childList: true });
        }, 5 * Timing.SECOND);
    }

    observeChat(callback: (message: IChatMessage) => void) {
        return this.events.on('message', (message) => callback(message!));
    }

    #createObserver() {
        return new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((addedElement) => {
                    this.#processAddedElement(addedElement as HTMLElement);
                });
            });
        });
    }

    #processAddedElement(addedElement: HTMLElement) {
        const messageWrapperEl = addedElement.querySelector?.<HTMLElement>('.chat-line__message');

        if (!messageWrapperEl) {
            return;
        }

        const userNameEl = messageWrapperEl.querySelector('[data-a-target="chat-message-username"]');
        const messageEl = messageWrapperEl.querySelector('[data-a-target="chat-message-text"]');

        if (!(userNameEl && messageEl)) {
            return;
        }

        const mentionEl = messageWrapperEl.querySelector('[data-a-target="chat-message-mention"]');

        const userName = userNameEl.textContent!.toLowerCase();
        const message = messageEl!.textContent!.toLowerCase().trim();
        const isSystemMessage = userName === 'hitsquadgodfather' || userName === 'hitsquadplays';
        const isReward = isSystemMessage && isRewardMessage(message);
        const isAkiraDrawReward = isSystemMessage && isAkiraDrawRewardMessage(message);
        const hasMyMention = mentionEl?.textContent?.toLowerCase().trim() === this.twitchUIService.twitchUserName;

        this.events.emit('message', {
            messageWrapperEl,
            userName,
            message,
            isSystemMessage,
            isReward,
            isAkiraDrawReward,
            hasMyMention
        });
    }
}
