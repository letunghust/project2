import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Checkbox, Form, Input, Radio, Space } from "antd";
import { getGeolocationPosition } from "../../../utils/geolocation.util.js";
import { doQuiz, getQuizByIdStudent } from "../../../request/quizz.request.js";
import { Loading } from "../../../components/loading/Loading.jsx";

export function DoQuiz() {
    const [loading, setLoading] = useState(true);
    const [quiz, setQuiz] = useState();

    const { id } = useParams();

    const getData = async () => {
        try {
            setLoading(true);
            const data = await getQuizByIdStudent(id);
            setQuiz(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
        // console.log(quiz);
    }, [id]);

    const handleSubmit = () => {
        getData();
    };

    if (loading || !quiz) return <Loading />;

    return <QuizForm quiz={quiz} onSubmit={handleSubmit} />;
}

const QuizForm = ({ quiz, onSubmit }) => {
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const formData = await form.validateFields();
            const answers = [];
            console.log(formData[0]);
            for (const questionId in formData) {
                const choice = [];
                for (const answerId in formData[questionId]) {
                    choice.push({
                        answerId: formData[questionId][answerId],
                        label: quiz.questions[questionId].answers[formData[questionId][answerId]].label,
                    });
                }
                answers.push({
                    questionId: Number(questionId),
                    answers: choice,
                });
            }
            const data = {
                position: await getGeolocationPosition(),
                answers: answers,
            };
            console.log(data);
            await doQuiz(id, data);
            onSubmit();
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center p-5">
            <h1 className="md:text-4xl text-blue-900 text-center shadow-bottom mb-4">{quiz.name}</h1>
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                validateTrigger="onBlur"
                className="md:w-250 w-full form-shadow p-5"
                labelAlign="left"
            >
                {quiz.studentAnswers[0] ? (
                    <div>
                        <div>Bạn đã hoàn thành quiz này</div>
                        <div>Điểm số: {quiz.studentAnswers[0].points}</div>
                    </div>
                ) : (
                    <>
                        {quiz.questions.map((q, i) => (
                            <Form.Item
                                key={i}
                                label={`${i + 1}) ${q.label}`}
                                name={q.questionId}
                                rules={[{ required: true, message: "Hãy chọn đáp án" }]}
                            >
                                <Checkbox.Group>
                                    <Space direction="vertical">
                                        {q.answers.map((a, j) => (
                                            <Checkbox key={j} value={a.answerId}>
                                                {a.label}
                                            </Checkbox>
                                        ))}
                                    </Space>
                                </Checkbox.Group>
                            </Form.Item>
                        ))}
                        <div className="text-center">
                            <Button
                                type="primary"
                                loading={loading}
                                htmlType="submit"
                                onClick={handleSubmit}
                                className="mr-1"
                            >
                                Nộp bài
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
};
