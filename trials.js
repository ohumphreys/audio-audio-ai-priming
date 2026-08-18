// Function used to avoid code repetition when creating the test and practice trials
function create_priming_trials(jsp, tvs, rand_order) {
    return {
        timeline: [
            {
                //Play prime stimulus
                type: jsPsychAudioKeyboardResponse,
                choices: "NO_KEYS",
                stimulus: jsp.timelineVariable('prime_stimulus'),
                response_allowed_while_playing: false,
                response_ends_trial: false,
                trial_ends_after_audio: true,
                prompt: ""
            },
            {
                // interstital
                type: jsPsychHtmlKeyboardResponse,
                choices: "NO_KEYS",
                stimulus: "",
                trial_duration: ISI_LENGTH,
                response_ends_trial: false
            },
            {
                //target stimulus, decision
                type: jsPsychAudioKeyboardResponse,
                choices: [INPUTS.word, INPUTS.nonword],
                stimulus: jsp.timelineVariable('target_stimulus'),
                response_allowed_while_playing: true,
                // prompt: `REAL: <kbd>${INPUTS.word}</kbd> PSEUDO: <kbd>${INPUTS.nonword}</kbd>`,
                trial_duration: 4000,
                prompt: `<div class=\"option_container\"><div class=\"option\">PSEUDOWORD<br><br><b>D</b></div><div class=\"option\">WORD<br><br><b>K</b></div></div>`,
                data: {
                    prime: jsp.timelineVariable('prime'),
                    target: jsp.timelineVariable('target'),
                    prime_syllables: jsp.timelineVariable('prime_syllables'),
                    target_syllables: jsp.timelineVariable('target_syllables'),
                    target_type: jsp.timelineVariable('target_type'),
                    condition: jsp.timelineVariable('condition'),
                    is_primed: jsp.timelineVariable('is_primed')
                }
            },
            {
                //pause before next trial
                type: jsPsychHtmlKeyboardResponse,
                choices: "NO_KEYS",
                stimulus: "",
                response_ends_trial: false,
                trial_duration: ITI_LENGTH
            }
        ],
        timeline_variables: tvs,
        randomize_order: rand_order
    }
};

const preload_files = [];

// This works to turn my JSONs into timeline variable things
async function create_timeline_variables(json_file, tv_array) {

    const data = await fetch(json_file).then(r => r.json())

    for (const trial of data) {

        const target_type = trial["target type"];

        const target_filename = target_type === "real"
            ? trial.target.charAt(0).toUpperCase() + trial.target.slice(1)
            : trial.target;
        const prime_filename = trial.prime.charAt(0).toUpperCase() + trial.prime.slice(1);

        const target_stim = `audio/${VOICE_BEING_TESTED}/${target_filename}.mp3`
        const prime_stim = `audio/${VOICE_BEING_TESTED}/${prime_filename}.mp3`

        preload_files.push(target_stim, prime_stim)

        const obj = {
            prime: trial["prime"],
            target: trial["target"],
            prime_syllables: trial["prime syllables"],
            target_syllables: trial["target syllables"],
            target_type: target_type,
            //renamed from trial_type to condition because jsPsych uses trial_type natively so it gets overriden
            condition: trial["trial type"],
            is_primed: trial["isprimed"],
            prime_stimulus: prime_stim,
            target_stimulus: target_stim
        }

        tv_array.push(obj)
    }

};

const practice_tvs = [];
const test_tvs = [];

//TODO: figure out how to increment which counterbalanced lists the user is on
//for now I'm just always assuming counterbalanced list 1 as a temporary strategy
let counterbalance_number = 1;

// experiment.js awaits this promise before building/running the jsPsych timeline,
// since fetching + parsing the trial lists above is asynchronous.
const timeline_variables_ready = (async () => {
    await create_timeline_variables("lists/Practice Trials.json", practice_tvs);
    await create_timeline_variables("lists/Identical Trials.json", test_tvs);
    await create_timeline_variables(`lists/Counterbalance ${counterbalance_number.toString()}.json`, test_tvs);
})();



// consent trial
const irb_intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p><font size="3">We invite you to participate in a research study on language comprehension.
    <br>Please review the form on the next page prior to beginning the study.</font></p>`,
    choices: ['Next']
};

const irb_doc = {
    type: jsPsychHtmlButtonResponse,
    choices: ['Continue'],
    stimulus: `
    <div style="text-align: right; font-size: 10px; line-height: 1.5;"><br><br>Approval Date: April 16, 2024
    <br>Expiration Date: Does Not Expire</div>
    
    <div class="irb-doc">Stanford University
    <br><b>Nonmedical Human Participants Consent Form and Waiver of Documentation</b>

    <br><br><b>STUDY TITLE:</b> Language Production and Comprehension Studies

    <br><br><b>Protocol Director:</b> Meghan Sumner

    <br><br><b>DESCRIPTION:</b> We invite you to participate in a research study on language production and comprehension.
    In this experiment, you will complete a linguistic task online such as reading sentences or words, naming
    pictures or describing scenes, making up sentences of your own, or participating in a simple language game.

    <br><br><b>RISKS AND BENEFITS:</b> There are no known risks, costs, or discomforts in this study and this judgment
    is based on a large body of experience with the same or similar procedures with people of similar ages,
    sex, origins, etc. We cannot and do not guarantee or promise that you will receive any benefits from this
    study. You will help us to understand how people recognize and perceive auditory stimuli.

    <br><br><b>TIME INVOLVEMENT:</b> Your participation in this experiment will take less than one hour.

    <br><br><b>PAYMENTS:</b> You will be paid for your participation at the posted rate, consisted with online payment
    standards. Some of the items in this experiment/survey are designed solely to check if you are paying
    attention. If you fail any of these attention checks, you will not be paid.

    <br><br><b>SUBJECT'S RIGHTS:</b> If you have read this form and have decided to participate in this project, please
    understand your participation is voluntary and you have the right to withdraw your consent or discontinue
    participation at any time without penalty or loss of benefits to which you are otherwise entitled. You have
    the right to refuse to answer particular questions. Your individual privacy will be maintained in all
    published and written data resulting from the study.

    <br><br><b>CONTACT INFORMATION:</b>
    <br>Questions, Concerns, or Complaints: If you have any questions, concerns or complaints about this
    research study, its procedures, risks and benefits, please contact Prof. Meghan Sumner at (650) 723-
    4284.

    <br><br>Independent Contact: If you are not satisfied with how this study is being conducted, or if you have any
    concerns, complaints, or general questions about the research or your rights as a participant, please
    contact the Stanford Institutional Review Board (IRB) to speak to someone independent of the research
    team at (650)-723-2480 or toll free at 1-866-680-2906. You can also write to the Stanford IRB, Stanford
    University, Stanford, CA 94305-5401 or email irbnonmed@stanford.edu.

    <br><br><b>WAIVER OF DOCUMENTATION</b>
    <br>If you agree to participate in this research, please continue to begin the study.<br><br>   </div>`
}


const irb_trial = [irb_intro, irb_doc]

// instructions trial - not able to progress for the first 4 seconds so people don't accidentally skip or rush through the instructions
const instructions_trial_pause = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `In this study, you will hear pairs of words. 
    Sometimes, the second word of the pair will be a REAL WORD (e.g., FOG). 
    Other times, the second word of the pair will NOT be a real word. We call these PSEUDOWORDS (e.g., SHISS). 
    For each pair, it is your job to tell us whether the second word of the pair is REAL or PSEUDO. 
    If it is a REAL word, press <kbd>${INPUTS.word}</kbd>. If it is PSEUDO, press <kbd>${INPUTS.nonword}</kbd>. 
    Please answer as quickly and accurately as possible.`,
    choices: [],
    trial_duration: 4000, // 4 seconds in ms,
    response_ends_trial: false
};

const instructions_trial_finish = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `In this study, you will hear pairs of words. 
    Sometimes, the second word of the pair will be a REAL WORD (e.g., FOG). 
    Other times, the second word of the pair will NOT be a real word. We call these PSEUDOWORDS (e.g., SHISS). 
    For each pair, it is your job to tell us whether the second word of the pair is REAL or PSEUDO. 
    If it is a REAL word, press <kbd>${INPUTS.word}</kbd>. If it is PSEUDO, press <kbd>${INPUTS.nonword}</kbd>. 
    Please answer as quickly and accurately as possible.
    <br><br>When you're ready to begin, press the space bar.`,
    choices: [" "]
};

const instructions_trial = [instructions_trial_pause, instructions_trial_finish];


//preload stimulus trial
const preload_trial = {
    type: jsPsychPreload,
    audio: preload_files,
    message: "Loading files . . ."
};

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
