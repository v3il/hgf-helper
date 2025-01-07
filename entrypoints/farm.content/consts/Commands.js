export const Commands = Object.freeze({
    HITSQUAD: '!hitsquad',

    ANSWER1: '!answer1',
    ANSWER2: '!answer2',
    ANSWER3: '!answer3',
    ANSWER4: '!answer4',

    getAnswers() {
        return [
            this.ANSWER1,
            this.ANSWER2,
            this.ANSWER3,
            this.ANSWER4
        ];
    }
});
