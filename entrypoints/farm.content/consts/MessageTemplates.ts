export const MessageTemplates = Object.freeze({
    TOO_MANY_STRIKES_NOTIFICATION: '{{name}} You have to many strikes to participate. Redeem the strike removal reward.'
        .toLowerCase(),

    AKIRA_DRAW_REWARD: 'Just Won 2000 Clams From Akiras Drawing!'.toLowerCase(),

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
    },

    isAkiraDrawReward(message: string) {
        return message.endsWith(this.AKIRA_DRAW_REWARD);
    }
});
