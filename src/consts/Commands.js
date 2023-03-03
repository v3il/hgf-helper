export const Commands = Object.freeze({
    HITSQUAD: '!hitsquad',
    BATTLEROYALE: '!battleroyale',
    GAUNTLET: '!gauntlet',

    getAll() {
        return [this.HITSQUAD, this.BATTLEROYALE, this.GAUNTLET];
    },

    getCommon() {
        return [this.BATTLEROYALE, this.GAUNTLET];
    }
});
