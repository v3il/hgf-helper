import { Commands, MessageTemplates } from '../consts';

export class LimitedHitsquadRunner {
    #twitchChatObserver;

    #lastBattleRoyalTime = 0;
    #lastHitsquadTimes = [0, 0, 0, 0, 0];

    constructor({ twitchChatObserver }) {
        this.#twitchChatObserver = twitchChatObserver;

        this.#listenEvents();
    }

    #listenEvents() {
        this.#twitchChatObserver.events.on('message', ({ userName, message }) => {
            this.#processMessage({ userName, message });
        });
    }

    #processMessage({ userName, message }) {
        // if (message.includes(MessageTemplates.NEW_QUIZ_QUESTION)) {
        //     this.#isWaitingNextRound = false;
        //     this.#desiredAnswerPosition = this.#getDesiredAnswerPosition();
        //
        //     this.#resetAnswers();
        //     this.#registerFallback();
        // }
        //
        // if (this.#isWaitingNextRound) {
        //     return;
        // }
        //
        // const isMe = this.#twitchUser.isCurrentUser(userName);
        // const answerInMessage = Commands.getAnswers().find((answer) => message.startsWith(answer));
        //
        // if (!answerInMessage) {
        //     return;
        // }
        //
        // if (isMe && answerInMessage) { // answered manually
        //     return this.#completeRound();
        // }
        //
        // if (this.#answeredUsers.includes(userName)) { // user answered again
        //     return;
        // }
        //
        // this.#answers[answerInMessage].add(userName);
        // const { answer, answersCount } = this.#getCorrectAnswer();
        //
        // if (answersCount + 1 === this.#desiredAnswerPosition) {
        //     console.error('send', answer, answersCount + 1);
        //     this.#completeRound(answer);
        // }
    }
}
