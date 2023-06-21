export const Commands = Object.freeze({
    HITSQUAD: '!hitsquad',

    ATTACK1: '!attack1',
    ATTACK2: '!attack2',
    ATTACK3: '!attack3',
    ATTACK4: '!attack4',
    ATTACK5: '!attack5',

    DIVINE1: '!divine1',
    DIVINE2: '!divine2',
    DIVINE3: '!divine3',
    DIVINE4: '!divine4',
    DIVINE5: '!divine5',
    HEAL: '!heal',

    MOAN: '!moan',

    FRENZY: '!frenzy',
    RALLY: '!rally',

    SHIELD: '!shield',
    FLAMES: '!flames',

    getMiniGameCommands() {
        return [this.HITSQUAD];
    },

    getShowdownCommands() {
        return [
            this.ATTACK1,
            this.ATTACK2,
            this.ATTACK3,
            this.ATTACK4,
            this.ATTACK5,

            this.DIVINE1,
            this.DIVINE2,
            this.DIVINE3,
            this.DIVINE4,
            this.DIVINE5,
            this.HEAL,

            this.MOAN,

            this.FRENZY,
            this.RALLY,

            this.SHIELD,
            this.FLAMES
        ];
    },

    getGameCommands() {
        return this.getMiniGameCommands().concat(this.getShowdownCommands());
    }
});
