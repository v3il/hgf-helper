import { sample } from 'lodash';
import { quizAnswers, MessageTemplates } from '../consts';

export class QuizService {
    static create({ twitchChatObserver, twitchChatService, twitchUser }) {
        return new QuizService({ twitchChatObserver, twitchChatService, twitchUser });
    }

    #twitchChatObserver;
    #twitchChatService;
    #twitchUser;

    #isWaitingNextRound = true;
    #isStopped = false;

    _chatContainerEl;
    // _observer;
    _twitchChatService;
    _twitchUser;

    // _isPaused = true;

    _fallbackTimeoutId;

    _desiredAnswerPosition;

    _answers = {};

    constructor({ twitchChatObserver, twitchChatService, twitchUser }) {
        this.#twitchChatObserver = twitchChatObserver;
        this.#twitchChatService = twitchChatService;
        this.#twitchUser = twitchUser;

        quizAnswers.forEach((answer) => {
            this._answers[answer] = new Set();
        });

        this.#listenEvents();
    }

    #listenEvents() {
        this.#twitchChatObserver.events.on('message', ({ userName, message }) => {
            if (this.#isStopped) {
                return;
            }

            this.#processMessage({ userName, message });
        });
    }

    #processMessage({ userName, message }) {
        if (message.includes(MessageTemplates.NEW_QUIZ_QUESTION)) {
            this.#isWaitingNextRound = false;
            this._desiredAnswerPosition = this._getDesiredAnswerPosition();

            console.error('Desired', this._desiredAnswerPosition);

            this._resetState();
            this._registerFallback();
        }

        if (this.#isWaitingNextRound) {
            return;
        }

        const isMyUser = this.#twitchUser.isCurrentUser(userName);
        const isValidAnswer = quizAnswers.includes(message);

        if (isMyUser && isValidAnswer) { // answered manually
            // this.#isWaitingNextRound = true;
            // clearTimeout(this._fallbackTimeoutId);
            return this.#waitForNextRound();
        }

        if (!isValidAnswer || isMyUser) {
            return;
        }

        this._answers[message].add(userName);
        const { answer, count } = this._getCorrectAnswer();

        console.error(answer, count);

        if (count === this._desiredAnswerPosition) {
            console.error('send', answer, count);
            this.#waitForNextRound();
            this.#sendAnswer(answer);
        }
    }

    #waitForNextRound() {
        this.#isWaitingNextRound = true;
        clearTimeout(this._fallbackTimeoutId);
    }

    #sendAnswer(answer) {
        this.#twitchChatService.sendMessage(answer);
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
                this.#isWaitingNextRound = true;
                this.#sendAnswer(answer);
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
        this.#isStopped = true;
    }

    stop() {
        this.#isStopped = false;
    }
}
