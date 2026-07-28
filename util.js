function evaluate_response(data) {
    if (data.response == 'd' & data.correct == 'NON-WORD') {
        data.result = "correct_rejection"
    } else if (data.response == 'k' & data.correct == 'NON-WORD') {
        data.result = "false_alarm"
    } else if (data.response == 'd' & data.correct == 'WORD') {
        data.result = "miss"
    } else  {
        data.result = "hit"
    }
}


function create_tv_array(json_object) {
    let tv_array = [];
    for (let i = 0; i < json_object.length; i++) {
        let obj = {};
        obj.prime_stimulus = json_object[i].prime_stimulus;
        obj.target_stimulus = json_object[i].target_stimulus;
        obj.data = {};
        obj.data.correct = json_object[i].correct;
        tv_array.push(obj)
    }
    return tv_array;
}