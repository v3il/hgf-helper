export const MessageTemplates = Object.freeze({
    isReward(message: string) {
        return /has been sent \d+ clams!/.test(message);
    },

    isAkiraDrawReward(message: string) {
        return /\w Just Won \d+ Clams From Akiras Drawing/i.test(message);
    }
});
