import { MessageTemplates, Timing, Commands } from '../consts';
import { generateDelay, promisifiedSetTimeout } from '../utils';

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

        Commands.getAnswers().forEach((answer) => {
            this.#answers[answer] = new Set();
        });

        this.#listenEvents();
    }

    get #answeredUsers() {
        return Object.values(this.#answers).flatMap((set) => Array.from(set));
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
        const answerInMessage = Commands.getAnswers().find((answer) => message.startsWith(answer));

        if (!answerInMessage) {
            return;
        }

        if (isMyUser && answerInMessage) { // answered manually
            return this.#completeRound();
        }

        if (this.#answeredUsers.includes(userName)) { // user answered again
            return;
        }

        this.#answers[answerInMessage].add(userName);
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

    async #sendAnswer(answer) {
        const delay = generateDelay(0.7 * Timing.SECOND, 2 * Timing.SECOND);

        await promisifiedSetTimeout(delay);
        this.#twitchChatService.sendMessage(answer);
    }

    #getPositionChances() {
        return {
            4: 0.5,
            5: 1
        };
    }

    #getDesiredAnswerPosition() {
        const chance = Math.random();
        const positionChances = this.#getPositionChances();

        return +Object.keys(positionChances).find((position) => positionChances[position] >= chance);
    }

    #resetAnswers() {
        Object.values(this.#answers).forEach((set) => set.clear());
    }

    #getFallbackDelay() {
        return 45 + Math.floor(Math.random() * 8);
    }

    #registerFallback() {
        const delay = this.#getFallbackDelay();

        this.#fallbackTimeoutId = setTimeout(() => {
            const { answer, answersCount } = this.#getCorrectAnswer();

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
