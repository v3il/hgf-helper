import { EventEmitter } from '../../shared';
import { Timing } from '../../../consts';

export class TwitchChatObserver {
    #events;
    #observer;
    #twitchUser;

    constructor({ twitchFacade }) {
        this.#events = EventEmitter.create();
        this.#twitchUser = twitchFacade.twitchUser;

        this.#observer = this.#createObserver();

        // Skip initial messages
        // todo: find a better way
        setTimeout(() => {
            this.#observer.observe(twitchFacade.chatScrollableAreaEl, { childList: true });
        }, 5 * Timing.SECOND);
    }

    get events() {
        return this.#events;
    }

    #createObserver() {
        return new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((addedElement) => {
                    this.#processAddedElement(addedElement);
                });
            });
        });
    }

    #processAddedElement(addedElement) {
        const messageWrapperEl = addedElement.querySelector?.('.chat-line__message');

        if (!messageWrapperEl) {
            return;
        }

        const userNameEl = addedElement.querySelector('[data-a-target="chat-message-username"]');
        const messageEl = addedElement.querySelector('[data-a-target="chat-message-text"]');

        if (!(userNameEl && messageEl)) {
            return;
        }

        const userName = userNameEl.textContent.toLowerCase();
        const message = messageEl.textContent.toLowerCase().trim();
        const isSystemMessage = userName === 'hitsquadgodfather';
        const isMe = this.#twitchUser.isCurrentUser(userName);

        this.#events.emit('message', {
            userName, message, isSystemMessage, isMe
        });
    }
}
