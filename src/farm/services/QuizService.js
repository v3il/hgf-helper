import { quizAnswers, MessageTemplates } from '../consts';
import { WaiterService } from './WaiterService';

export class QuizService {
    static create({ twitchChatObserver, twitchChatService, twitchUser }) {
        return new QuizService({ twitchChatObserver, twitchChatService, twitchUser });
    }

    #twitchChatObserver;
    #twitchChatService;
    #twitchUser;

    #isWaitingNextRound = true;
    #isStopped = true;

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
        const { answer, answersCount } = this.#getCorrectAnswer();

        if (answersCount + 1 === this.#desiredAnswerPosition) {
            console.error('send', answer, answersCount + 1);
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
        WaiterService.instance.wait(200, 150);
        this.#twitchChatService.sendMessage(answer);
    }

    #getPositionChances() {
        return {
            3: 0.2,
            4: 0.6,
            5: 1
        };
    }

    #getDesiredAnswerPosition() {
        const chance = Math.random();
        const positionChances = this.#getPositionChances();

        console.info(positionChances, chance);

        return +Object.keys(positionChances).find((position) => positionChances[position] >= chance);
    }

    #resetAnswers() {
        Object.values(this.#answers).forEach((set) => set.clear());
    }

    #getFallbackDelay() {
        const randomPart = Math.floor(Math.random() * 8);

        return 45 + randomPart;
    }

    #registerFallback() {
        const delay = this.#getFallbackDelay();

        this.#fallbackTimeoutId = setTimeout(() => {
            const { answer, answersCount } = this.#getCorrectAnswer();

            console.error('Fallback', answer, answersCount);

            if (answersCount >= 1) {
                this.#completeRound(answer);
            }
        }, delay * 1000);
    }

    #getCorrectAnswer() {
        const sortedAnswers = Object.entries(this.#answers)
            .map(([answer, usersSet]) => ({ answer, answersCount: usersSet.size }))
            .sort((a, b) => b.answersCount - a.answersCount);

        return sortedAnswers[0];
    }

    start() {
        this.#isStopped = false;
    }

    stop() {
        this.#isStopped = true;
    }
}
