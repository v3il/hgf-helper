import { sample } from 'lodash';
import { quizAnswers, MessageTemplates, selfUsernames } from '../consts';

export class QuizService {
    #chatContainerEl;
    #observer;
    #twitchChatService;

    #isPaused = true;

    #fallbackTimeoutId;

    #desiredAnswerPosition;

    #answers = {
        '!answer1': new Set(),
        '!answer2': new Set(),
        '!answer3': new Set(),
        '!answer4': new Set()
    };

    constructor({ chatContainerEl, twitchChatService }) {
        this.#chatContainerEl = chatContainerEl;
        this.#observer = this._createObserver();
        this.#twitchChatService = twitchChatService;
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
        const message = messageEl.textContent.toLowerCase();

        if (message.includes(MessageTemplates.NEW_QUIZ_QUESTION)) {
            this.#isPaused = false;
            this.#desiredAnswerPosition = this._getDesiredAnswerPosition();

            this._resetState();
            this._registerFallback();

            console.log('new question', this.#desiredAnswerPosition);
        }

        if (this.#isPaused) {
            // console.error(1);
            return;
        }

        const isMe = selfUsernames.includes(userName);
        const isCorrectAnswer = quizAnswers.includes(message);

        if (!isCorrectAnswer || isMe) {
            return;
        }

        this.#answers[message].add(userName);
        const { answer, count } = this._getCorrectAnswer();

        console.error(answer, count);

        if (count === this.#desiredAnswerPosition) {
            console.error('send', answer);
            this._sendAnswer(answer);
            this.#isPaused = true;
            clearTimeout(this.#fallbackTimeoutId);
        }
    }

    _sendAnswer(answer) {
        this.#twitchChatService.sendMessage(answer);
    }

    _getDesiredAnswerPosition() {
        return sample([2, 3, 4]);
    }

    _resetState() {
        Object.values(this.#answers).forEach((set) => set.clear());
    }

    _registerFallback() {
        this.#fallbackTimeoutId = setTimeout(() => {
            const { answer, count } = this._getCorrectAnswer();

            console.error('Fallback', answer, count);

            if (count >= 1) {
                console.error('send', answer);
                this.#isPaused = true;
                this._sendAnswer(answer);
            }
        }, 45000);
    }

    _getCorrectAnswer() {
        let answer = '';
        let count = 0;

        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const command in this.#answers) {
            const set = this.#answers[command];

            if (set.size > count) {
                answer = command;
                count = set.size;
            }
        }

        return { answer, count };
    }

    start() {
        this.#observer.observe(this.#chatContainerEl, { childList: true });
    }

    stop() {
        this.#observer.unobserve(this.#chatContainerEl);
    }
}
