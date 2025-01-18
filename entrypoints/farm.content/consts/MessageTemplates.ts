export const MessageTemplates = Object.freeze({
    NEW_QUIZ_QUESTION: 'New Trivia Question 60 Seconds To Answer'.toLowerCase(),
    TOO_MANY_STRIKES_NOTIFICATION: '{{name}} You have to many strikes to participate. Redeem the strike removal reward.'
        .toLowerCase(),

    get hitsquadRewards() {
        return [100, 200, 1000, 2500]
            .flatMap((reward) => [reward, reward * 2])
            .map((reward) => `Has Been Sent ${reward} Clams!`.toLowerCase());
    },

    isHitsquadReward(message: string) {
        return this.hitsquadRewards.some((template) => message.includes(template));
    },

    isTooManyStrikesNotification(message: string, name: string) {
        return message === this.TOO_MANY_STRIKES_NOTIFICATION.replace('{{name}}', name);
    }
});
