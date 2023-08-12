import { AnswerKey } from './../types/AnswerKey.type';

export const examineAnswers = (answers: AnswerKey[], keys: AnswerKey[]) => {
    let points = 0;
    answers.sort((a, b) => a.questionId - b.questionId);
    for (let i = 0; i < answers.length; i++) {
        for (let j = 0; j < keys.length; j++) {
            if (keys[j].questionId === answers[i].questionId) {
                let correct = 0;
                let num_correct = 0;
                let num_incorrect = 0;
                for (let k = 0; k < answers[i].answers.length; k++) {
                    for (let h = 0; h < keys[j].answers.length; h++) {
                        if (answers[i].answers[k].answerId === keys[j].answers[h].answerId) {
                            correct += 1;
                        }
                    }
                    if (correct === 0) num_incorrect += 1;
                    else num_correct += 1;
                }
                points =
                    points +
                    (num_correct - num_incorrect > 0 ? (num_correct - num_incorrect) / keys[j].answers.length : 0);
            }
        }
    }

    return points;
};
