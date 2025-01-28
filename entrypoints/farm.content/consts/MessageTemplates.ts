const hitsquadRewards = [100, 200, 1000, 2500]
    .flatMap((reward) => [reward, reward * 2])
    .map((reward) => `Has Been Sent ${reward} Clams!`.toLowerCase());

const TOO_MANY_STRIKES = '{{name}} You have to many strikes to participate. Redeem the strike removal reward.'
    .toLowerCase();

export const MessageTemplates = Object.freeze({
    isHitsquadReward(message: string) {
        return hitsquadRewards.some((template) => message.includes(template));
    },

    isTooManyStrikesNotification(message: string, name: string) {
        return message === TOO_MANY_STRIKES.replace('{{name}}', name);
    },

    isAkiraDrawReward(message: string) {
        return /\w Just Won \d+ Clams From Akiras Drawing/i.test(message);
    }
});
