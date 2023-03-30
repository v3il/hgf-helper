import { sample } from 'lodash';
import { quizAnswers, MessageTemplates } from '../consts';

export class QuizService {
    static create({ twitchChatObserver, twitchChatService, twitchUser }) {
        return new QuizService({ twitchChatObserver, twitchChatService, twitchUser });
    }

    #twitchChatObserver;

    _chatContainerEl;
    _observer;
    _twitchChatService;
    _twitchUser;

    _isPaused = true;

    _fallbackTimeoutId;

    _desiredAnswerPosition;

    _answers = {};

    constructor({ twitchChatObserver, twitchChatService, twitchUser }) {
        this.#twitchChatObserver = twitchChatObserver;
        this._observer = this._createObserver();
        this._twitchChatService = twitchChatService;
        this._twitchUser = twitchUser;

        this.#listenEvents();

        quizAnswers.forEach((answer) => {
            this._answers[answer] = new Set();
        });
    }

    #listenEvents() {
        this.#twitchChatObserver.events.on('message', ({ userName, message }) => {
            console.error(userName, message);
        });
    }

    #processMessage({ userName, message }) {

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
            this._isPaused = false;
            this._desiredAnswerPosition = this._getDesiredAnswerPosition();

            console.error('Desired', this._desiredAnswerPosition);

            this._resetState();
            this._registerFallback();
        }

        if (this._isPaused) {
            return;
        }

        const isMyUser = this._twitchUser.isCurrentUser(userName);
        const isValidAnswer = quizAnswers.includes(message);

        if (isMyUser && isValidAnswer) { // answered manually
            this._isPaused = true;
            clearTimeout(this._fallbackTimeoutId);
            return;
        }

        if (!isValidAnswer || isMyUser) {
            return;
        }

        this._answers[message].add(userName);
        const { answer, count } = this._getCorrectAnswer();

        console.error(answer, count);

        if (count === this._desiredAnswerPosition) {
            console.error('send', answer, count);
            this._sendAnswer(answer);
            this._isPaused = true;
            clearTimeout(this._fallbackTimeoutId);
        }
    }

    _sendAnswer(answer) {
        this._twitchChatService.sendMessage(answer);
    }

    _getDesiredAnswerPosition() {
        return sample([2, 3, 4]);
    }

    _resetState() {
        Object.values(this._answers).forEach((set) => set.clear());
    }

    _registerFallback() {
        const delay = 40 + Math.floor(Math.random() * 14);

        console.error(delay * 1000);

        this._fallbackTimeoutId = setTimeout(() => {
            const { answer, count } = this._getCorrectAnswer();

            console.error('Fallback', answer, count);

            if (count >= 1) {
                console.error('send', answer);
                this._isPaused = true;
                this._sendAnswer(answer);
            }
        }, delay * 1000);
    }

    _getCorrectAnswer() {
        let answer = '';
        let count = 0;

        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const command in this._answers) {
            const set = this._answers[command];

            if (set.size > count) {
                answer = command;
                count = set.size;
            }
        }

        return { answer, count };
    }

    start() {
        // this._observer.observe(this._chatContainerEl, { childList: true });
    }

    stop() {
        this._observer.disconnect();
    }
}
