const hitsquadRewards = [50, 100, 500, 1250]
    .flatMap((reward) => [reward, reward * 2])
    .map((reward) => `Has Been Sent ${reward} Clams!`.toLowerCase());

export const MessageTemplates = Object.freeze({
    isHitsquadReward(message: string) {
        return hitsquadRewards.some((template) => message.includes(template));
    },

    isAkiraDrawReward(message: string) {
        return /\w Just Won \d+ Clams From Akiras Drawing/i.test(message);
    }
});
