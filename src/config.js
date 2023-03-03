export const config = Object.freeze({
    commands: ['!hitsquad', '!battleroyale', '!gauntlet'],
    // intervalBetweenRounds: 4 * 60 * 1000,
    intervalBetweenRounds: 3 * 1000,
    intervalBetweenCommands: 3000
});

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
