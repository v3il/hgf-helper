import { EventEmitter } from '@components/EventEmitter';
import { MessageTemplates } from '@twitch/consts';
import { Timing } from '@components/consts';
import { Container, Service } from 'typedi';
import { TwitchUIService } from '@twitch/modules';

export interface IChatMessage {
    messageWrapperEl: HTMLElement;
    userName: string;
    message: string;
    isSystemMessage: boolean;
    isHitsquadReward: boolean;
    isAkiraDrawReward: boolean;
    hasMyMention: boolean;
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
        const isHitsquadReward = isSystemMessage && MessageTemplates.isHitsquadReward(message);
        const isAkiraDrawReward = isSystemMessage && MessageTemplates.isAkiraDrawReward(message);
        const hasMyMention = mentionEl?.textContent?.toLowerCase().trim() === this.twitchUIService.twitchUserName;

        this.events.emit('message', {
            messageWrapperEl,
            userName,
            message,
            isSystemMessage,
            isHitsquadReward,
            isAkiraDrawReward,
            hasMyMention
        });
    }
}
