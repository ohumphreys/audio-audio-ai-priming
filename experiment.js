
const jsPsych = initJsPsych({
    show_progress_bar: true,
    on_finish: function(data) {
    window.location.href = 'finish.html';
    }
});

//all of the trials were created in trials.js, this now populates the timeline
let timeline = [];

timeline.push(irb_trial);
// demographics survey
// preload stimulus
timeline.push(instructions_trial);
// practice trials
const critical_trials = create_priming_trials(jsPsych, trial_objects);
timeline.push(critical_trials);
timeline.push(exit_survey);


// TODO: data saving
const subject_id = jsPsych.randomization.randomID(10);
const filename = `${subject_id}.csv`;

const save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: "A902rKEXAULc",
  filename: filename,
  data_string: ()=>jsPsych.data.get().csv()
};

timeline.push(save_data);

//TODO: whether the demographics survey goes at the beginning or the end


jsPsych.run(timeline);