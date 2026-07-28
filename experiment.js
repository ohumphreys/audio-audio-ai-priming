
const jsPsych = initJsPsych({
    show_progress_bar: true,
    on_finish: function(data) {
    window.location.href = 'finish.html';
    }
});


const subject_id = jsPsych.randomization.randomID(10);
const filename = `${subject_id}.csv`;

let timeline = [];

// TODO: consent form trial
const irb = {
    // Which plugin to use
    type: jsPsychHtmlButtonResponse,
    // What should be displayed on the screen
    stimulus: '<p><font size="3">We invite you to participate in a research study on language production and comprehension.</font></p>',
    // What should the button(s) say
    choices: ['Continue']
};
timeline.push(irb)

// TODO: preload stimulus

// TODO: instructions trial
const instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `In this experiment, you will hear a series of words. 
    If you think this is a real word in English, press <kbd>${INPUTS.word}</kbd> for WORD. 
    If you don't think it's a real word, press <kbd>${INPUTS.nonword}</kbd> for NON-WORD.
    <br>When you're ready to begin, press the space bar.`,
    choices: [" "]
};
timeline.push(instructions);

// TODO: practice trials

// TODO: critical trials
const trial_procedure = {
    timeline: [
        {
            type: jsPsychAudioKeyboardResponse,
            choices: "NO_KEYS",
            stimulus: jsPsych.timelineVariable('prime_stimulus'),
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
            stimulus: jsPsych.timelineVariable('target_stimulus'),
            response_allowed_while_playing: true,
            //trial_duration: 4000,
            prompt: `<div class=\"option_container\"><div class=\"option\">NON-WORD<br><br><b>D</b></div><div class=\"option\">WORD<br><br><b>K</b></div></div>`,
            on_finish: function(data) {
                evaluate_response(data);
            },
            data: {
                correct: jsPsych.timelineVariable('correct')
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
    timeline_variables: trial_objects,
    randomize_order: true
};
timeline.push(trial_procedure);

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

timeline.push(exit_survey);


// TODO: data saving
const save_data = {
            type: jsPsychPipe,
            action: "save",
            experiment_id: "XXXXX", // TODO: replace with your experiment ID
            filename: filename,
            data_string: ()=>jsPsych.data.get().csv()
        };

timeline.push(save_data);

// TODO: demographics survey
// Also TODO: whether the demographics survey goes at the beginning or the end


jsPsych.run(timeline)
