import { Container } from 'typedi';
import { EventEmitter } from '../models/EventsEmitter';
import { InjectionTokens } from '../consts';

export class TwitchChatObserver {
    static create(twitchChatContainerEl) {
        const twitchUser = Container.get(InjectionTokens.TWITCH_USER);
        const events = new EventEmitter();
        return new TwitchChatObserver({ twitchChatContainerEl, events, twitchUser });
    }

    #events;
    #twitchChatContainerEl;
    #observer;
    #twitchUser;

    constructor({ twitchChatContainerEl, events, twitchUser }) {
        this.#events = events;
        this.#twitchChatContainerEl = twitchChatContainerEl;
        this.#twitchUser = twitchUser;

        this.#observer = this.#createObserver();
        this.#observer.observe(this.#twitchChatContainerEl, { childList: true });
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
