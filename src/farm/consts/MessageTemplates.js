export const MessageTemplates = Object.freeze({
    NEW_QUIZ_QUESTION: 'new trivia question', // New Trivia Question 60 Seconds To Answer!!
    NEW_QUIZ_SESSION: 'Has Been Sent 250 Clams!'.toLowerCase(), // hitsquadgodfather: XXX Has Been Sent 250 Clams!
    HITSQUAD_REWARD1: 'Has Been Sent 100 Clams!'.toLowerCase(), // hitsquadgodfather: XXX Has Been Sent 100 Clams!
    HITSQUAD_REWARD2: 'Has Been Sent 200 Clams!'.toLowerCase(), // hitsquadgodfather: XXX Has Been Sent 200 Clams!
    HITSQUAD_REWARD3: 'Has Been Sent 1000 Clams!'.toLowerCase(), // hitsquadgodfather: XXX Has Been Sent 1000 Clams!
    HITSQUAD_REWARD4: 'Has Been Sent 10000 Clams!'.toLowerCase(), // hitsquadgodfather: XXX Has Been Sent 10000 Clams!

    isHitsquadReward(message) {
        return [this.HITSQUAD_REWARD1, this.HITSQUAD_REWARD2, this.HITSQUAD_REWARD3, this.HITSQUAD_REWARD4]
            .some((template) => message.includes(template.toLowerCase()));
    }
});
