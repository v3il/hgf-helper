import { quizUsers } from '../consts/quizUsers';
import { quizAnswers } from '../consts/quizAnswers';
import { promisifiedSetTimeout } from '../utils/promisifiedSetTimeout';

export class QuizService {
    #chatContainerEl;
    #observer;
    #twitchService;
    #streamService;

    #isPaused = false;

    constructor({ chatContainerEl, twitchService, streamService }) {
        this.#chatContainerEl = chatContainerEl;
        this.#observer = this._createObserver();
        this.#twitchService = twitchService;
        this.#streamService = streamService;
    }

    _createObserver() {
        return new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((addedElement) => {
                    this._processAddedElement(addedElement);
                });
            });
        });
    }

    async _processAddedElement(addedElement) {
        if (this.#isPaused) {
            return;
        }

        const isMessage = addedElement.classList.contains('chat-line__message');

        if (!isMessage) {
            return;
        }

        const userNameEl = addedElement.querySelector('[data-a-target="chat-message-username"]');
        const messageEl = addedElement.querySelector('[data-a-target="chat-message-text"]');

        if (!(userNameEl && messageEl)) {
            return;
        }

        const userName = userNameEl.textContent.toLowerCase();
        const message = messageEl.textContent.toLowerCase();

        const isCorrectUser = quizUsers.includes(userName);
        const isCorrectAnswer = quizAnswers.includes(message);

        if (isCorrectUser && isCorrectAnswer) {
            this._pause();
            this._sendAnswer(message);
        }
    }

    async _sendAnswer(answer) {
        const { isBan } = await this.#streamService.isBanPhase();

        if (isBan) {
            return;
        }

        console.error('Send', answer);

        const delay = Math.random() * 500 + 1000;
        await promisifiedSetTimeout(delay);
        // this.#twitchService.sendMessage(answer);
    }

    _pause() {
        this.#isPaused = true;

        setTimeout(() => {
            this.#isPaused = false;
        }, 50 * 1000);
    }

    start() {
        this.#observer.observe(this.#chatContainerEl, {
            childList: true,
            subtree: true
        });
    }
}
