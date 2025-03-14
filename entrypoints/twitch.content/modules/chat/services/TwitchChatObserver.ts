import { EventEmitter } from '@components/shared';
import { MessageTemplates, Timing } from '@twitch/consts';
import { ContainerInstance } from 'typedi';
import { TwitchFacade } from '../../twitch';

export interface IChatMessage {
    userName: string;
    message: string;
    isSystemMessage: boolean;
    isMe: boolean;
    isHitsquadReward: boolean;
    isAkiraDrawReward: boolean;
}

export class TwitchChatObserver {
    private readonly twitchFacade!: TwitchFacade;

    readonly events;
    private observer;

    constructor(container: ContainerInstance) {
        this.events = EventEmitter.create<{
            message: IChatMessage;
        }>();

        this.twitchFacade = container.get(TwitchFacade);
        this.observer = this.#createObserver();

        // Skip initial messages
        // todo: find a better way
        setTimeout(() => {
            this.observer.observe(this.twitchFacade.chatScrollableAreaEl!, { childList: true });
        }, 5 * Timing.SECOND);
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
        const messageWrapperEl = addedElement.querySelector?.('.chat-line__message');

        if (!messageWrapperEl) {
            return;
        }

        const userNameEl = addedElement.querySelector('[data-a-target="chat-message-username"]');
        const messageEl = addedElement.querySelector('[data-a-target="chat-message-text"]');

        if (!(userNameEl && messageEl)) {
            return;
        }

        const userName = userNameEl.textContent!.toLowerCase();
        const message = messageEl!.textContent!.toLowerCase().trim();
        const isSystemMessage = userName === 'hitsquadgodfather' || userName === 'hitsquadplays';
        const isMe = this.twitchFacade.twitchUserName === userName;
        const isHitsquadReward = isSystemMessage && MessageTemplates.isHitsquadReward(message);
        const isAkiraDrawReward = isSystemMessage && MessageTemplates.isAkiraDrawReward(message);

        this.events.emit('message', {
            userName,
            message,
            isSystemMessage,
            isMe,
            isHitsquadReward,
            isAkiraDrawReward
        });
    }
}
