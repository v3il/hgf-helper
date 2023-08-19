export const MessageTemplates = Object.freeze({
    NEW_QUIZ_QUESTION: 'New Trivia Question 60 Seconds To Answer'.toLowerCase(),
    NEW_QUIZ_SESSION: 'Has Been Sent 250 Clams!'.toLowerCase(),
    HITSQUAD_REWARD100: 'Has Been Sent 100 Clams!'.toLowerCase(),
    HITSQUAD_REWARD200: 'Has Been Sent 200 Clams!'.toLowerCase(),
    HITSQUAD_REWARD1000: 'Has Been Sent 1000 Clams!'.toLowerCase(),
    HITSQUAD_REWARD10000: 'Has Been Sent 10000 Clams!'.toLowerCase(),

    isHitsquadReward(message) {
        return [this.HITSQUAD_REWARD100, this.HITSQUAD_REWARD200, this.HITSQUAD_REWARD1000, this.HITSQUAD_REWARD10000]
            .some((template) => message.includes(template));
    }
});
