const INPUTS = Object.freeze({
    word: 'k',
    nonword: 'd'
});

const TRIAL_RESULTS = Object.freeze({
    accurate_word: 'hit',
    inaccurate_nonword: 'miss',
    inaccurate_word: 'false_alarm',
    accurate_nonword: 'correct_rejection'
})

const TARGET_TYPES = Object.freeze({
    word: "WORD",
    nonword: "NONWORD"
})