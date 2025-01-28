import { EventEmitter } from '@components/shared';
import { MessageTemplates, Timing } from '@farm/consts';
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
    readonly events;
    private twitchUser;
    private observer;

    constructor({ twitchFacade }: {twitchFacade: TwitchFacade}) {
        this.events = EventEmitter.create<{
            message: IChatMessage;
        }>();

        this.twitchUser = twitchFacade.twitchUser;
        this.observer = this.#createObserver();

        // Skip initial messages
        // todo: find a better way
        setTimeout(() => {
            this.observer.observe(twitchFacade.chatScrollableAreaEl!, { childList: true });
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
        const isSystemMessage = userName === 'hitsquadgodfather';
        const isMe = this.twitchUser.isCurrentUser(userName);
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
