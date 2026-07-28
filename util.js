function evaluate_response(data) {
    if (data.response == INPUTS.nonword && data.correct == TARGET_TYPES.nonword) {
        data.result = TRIAL_RESULTS.accurate_nonword
    } else if (data.response == INPUTS.word && data.correct == TARGET_TYPES.nonword) {
        data.result = TRIAL_RESULTS.inaccurate_word
    } else if (data.response == INPUTS.nonword && data.correct == TARGET_TYPES.word) {
        data.result = TRIAL_RESULTS.inaccurate_nonword
    } else {
        data.result = TRIAL_RESULTS.accurate_word
    }
}