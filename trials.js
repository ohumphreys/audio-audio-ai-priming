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
    "target1.wav": "NON-WORD",
    "target2.wav": "NON-WORD",
    "target3.wav": "WORD"
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