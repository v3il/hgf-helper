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

    #answers = {};

    #fallbackTimeoutId;
    #desiredAnswerPosition;

    constructor({ twitchChatObserver, twitchChatService, twitchUser }) {
        this.#twitchChatObserver = twitchChatObserver;
        this.#twitchChatService = twitchChatService;
        this.#twitchUser = twitchUser;

        quizAnswers.forEach((answer) => {
            this.#answers[answer] = new Set();
        });

        this.#listenEvents();
    }

    #listenEvents() {
        this.#twitchChatObserver.events.on('message', ({ userName, message }) => {
            if (!this.#isStopped) {
                this.#processMessage({ userName, message });
            }
        });
    }

    #processMessage({ userName, message }) {
        if (message.includes(MessageTemplates.NEW_QUIZ_QUESTION)) {
            this.#isWaitingNextRound = false;
            this.#desiredAnswerPosition = this.#getDesiredAnswerPosition();

            console.error('Desired', this.#desiredAnswerPosition);

            this.#resetAnswers();
            this.#registerFallback();
        }

        if (this.#isWaitingNextRound) {
            return;
        }

        const isMyUser = this.#twitchUser.isCurrentUser(userName);
        const isValidAnswer = quizAnswers.includes(message);

        if (isMyUser && isValidAnswer) { // answered manually
            return this.#completeRound();
        }

        if (!isValidAnswer) {
            return;
        }

        this.#answers[message].add(userName);
        const { answer, count } = this._getCorrectAnswer();

        console.error(answer, count);

        if (count === this.#desiredAnswerPosition) {
            console.error('send', answer, count);
            this.#completeRound(answer);
        }
    }

    #completeRound(answer) {
        this.#isWaitingNextRound = true;
        clearTimeout(this.#fallbackTimeoutId);

        if (answer) {
            this.#sendAnswer(answer);
        }
    }

    #sendAnswer(answer) {
        this.#twitchChatService.sendMessage(answer);
    }

    #getDesiredAnswerPosition() {
        return sample([2, 3, 4]);
    }

    #resetAnswers() {
        Object.values(this.#answers).forEach((set) => set.clear());
    }

    #registerFallback() {
        const delay = 40 + Math.floor(Math.random() * 14);

        this.#fallbackTimeoutId = setTimeout(() => {
            const { answer, count } = this._getCorrectAnswer();

            console.error('Fallback', answer, count);

            if (count >= 1) {
                console.error('send', answer);
                this.#completeRound(answer);
            }
        }, delay * 1000);
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
        this.#isStopped = false;
    }

    stop() {
        this.#isStopped = true;
    }
}
