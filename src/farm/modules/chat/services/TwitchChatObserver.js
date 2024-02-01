import { EventEmitter } from '../../shared';

export class TwitchChatObserver {
    #events;
    #observer;
    #twitchUser;

    constructor({ twitchFacade }) {
        this.#events = EventEmitter.create();
        this.#twitchUser = twitchFacade.twitchUser;

        this.#observer = this.#createObserver();
        this.#observer.observe(twitchFacade.chatScrollableAreaEl, { childList: true });
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
        const isMessage = addedElement.classList && addedElement.classList.contains('chat-line__message');

        if (!isMessage) {
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
