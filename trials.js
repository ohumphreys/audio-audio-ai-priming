// Function used to avoid code repetition when creating the critical and practice trials
function create_priming_trials(jsp, tvs, rand_order=true) {
    return {
        timeline: [
            {
                type: jsPsychAudioKeyboardResponse,
                choices: "NO_KEYS",
                stimulus: jsp.timelineVariable('prime_stimulus'),
                response_allowed_while_playing: false,
                trial_ends_after_audio: true,
                prompt: ""
            },
            {
                type: jsPsychHtmlKeyboardResponse,
                choices: "NO_KEYS",
                stimulus: "",
                trial_duration: 500,
                response_ends_trial: false
            },
            {
                type: jsPsychAudioKeyboardResponse,
                choices: ['d', 'k'],
                stimulus: jsp.timelineVariable('target_stimulus'),
                response_allowed_while_playing: true,
                //trial_duration: 4000,
                prompt: `<div class=\"option_container\"><div class=\"option\">NON-WORD<br><br><b>D</b></div><div class=\"option\">WORD<br><br><b>K</b></div></div>`,
                on_finish: function(data) {
                    evaluate_response(data);
                },
                data: {
                    correct: jsp.timelineVariable('correct')
                }
            },
            {
                type: jsPsychHtmlKeyboardResponse,
                choices: [""],
                stimulus: "",
                response_ends_trial: false,
                trial_duration: 1000
            }
        ],
        timeline_variables: tvs,
        randomize_order: rand_order
    }
};

// Create the critical trials


// TODO: randomization logic for each individual run, and then converting that randomization into an appropriate list of trials
// the below is just filler example

// One trial is created per target file. Prime files are paired in order
// and reused cyclically if there are fewer primes than targets.
const prime_files = [
    "prime1.wav",
    "prime2.wav",
    "prime3.wav"
];

const target_files = [
    "target1.wav",
    "target2.wav",
    "target3.wav"
];

// Set the lexical decision answer for each target file.
// Extend this map as you add target files.
const target_correct_map = {
    "target1.wav": TARGET_TYPES.nonword,
    "target2.wav": TARGET_TYPES.nonword,
    "target3.wav": TARGET_TYPES.word
};

let trial_objects = target_files.map((target_file, i) => {
    const prime_file = prime_files[i % prime_files.length];
    const correct_label = target_correct_map[target_file];
    if (!correct_label) {
        throw new Error(`Missing correct label for target file: ${target_file}`);
    }

    return {
        prime_stimulus: `audio/prime/${prime_file}`,
        target_stimulus: `audio/target/${target_file}`,
        correct: correct_label
    };
});

// TODO: practice trials (use create_priming_trials)


// TODO: consent trial
const irb_trial = {
    // Which plugin to use
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p><font size="3">We invite you to participate in a research study on language production and comprehension.</font></p>',
    choices: ['Continue']
};

// TODO: instructions trial
const instructions_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `In this experiment, you will hear two words. You're task is to identify whether the <strong>second word</strong> is a real or fake word. 
    If you think this is a real word in English, press <kbd>${INPUTS.word}</kbd> for WORD. 
    If you don't think it's a real word, press <kbd>${INPUTS.nonword}</kbd> for NON-WORD.
    <br><br>When you're ready to begin, press the space bar.`,
    choices: [" "]
};


// TODO: preload stimulus

// TODO: exit survey
const exit_survey = {
    type: jsPsychSurveyHtmlForm,
    preamble: '<p><strong>Exit survey</strong></p><p>Please answer the questions below to finish the study.</p>',
    html: `
        <p>
            <label for="age">Age:</label><br>
            <input id="age" name="age" type="number" min="0" max="120" required />
        </p>
        <p>
            <span>Gender:</span><br>
            <label><input type="radio" name="gender" value="Woman" required /> Woman</label><br>
            <label><input type="radio" name="gender" value="Man" /> Man</label><br>
            <label><input type="radio" name="gender" value="Non-binary" /> Non-binary</label><br>
            <label><input type="radio" name="gender" value="Prefer not to say" /> Prefer not to say</label>
        </p>
        <p>
            <label for="language_background">Language background:</label><br>
            <textarea id="language_background" name="language_background" rows="4" cols="50" required></textarea>
        </p>
    `,
    button_label: 'Submit',
    data: {task: 'exit_survey'}
};

// TODO: demographics survey
