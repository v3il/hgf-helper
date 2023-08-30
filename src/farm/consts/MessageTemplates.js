export const MessageTemplates = Object.freeze({
    NEW_QUIZ_QUESTION: 'New Trivia Question 60 Seconds To Answer'.toLowerCase(),
    NEW_QUIZ_SESSION: 'Has Been Sent 250 Clams!'.toLowerCase(),

    get hitsquadRewards() {
        return [100, 200, 1000, 2500]
            .flatMap((reward) => [reward, reward * 2])
            .map((reward) => `Has Been Sent ${reward} Clams!`.toLowerCase());
    },

    isHitsquadReward(message) {
        return this.hitsquadRewards.some((template) => message.includes(template));
    }
});
