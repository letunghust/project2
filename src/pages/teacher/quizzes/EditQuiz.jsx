import { useParams } from "react-router";
import React, { useEffect, useState } from "react";
import "../../../assets/styles/formStyle.css";
import { Button, DatePicker, Form, Input, Modal, Space, Switch, message } from "antd";
import { useNavigate } from "react-router";
import { Quiz } from "../../../components/Question.jsx";
import { dayjs } from "../../../utils/dayjs.util.js";
import { getQuizByIdTeacher, updateQuiz } from "../../../request/quizz.request.js";
import { useSelector } from "react-redux";

export const UpdateQuiz = () => {
    const [location, setLocation] = useState();

    const { id } = useParams();
    const [closeTime, setCloseTime] = useState();
    const option = useSelector((state) => state.option);
    const [status, setStatus] = useState(0);
    const navigate = useNavigate();

    const [form] = Form.useForm();

    const [testData, setTestData] = useState({
        testName: "",
        classId: "",
        quizzes: [],
    });

    const handleQuizAdd = () => {
        setTestData((prevData) => ({
            ...prevData,
            quizzes: [
                ...prevData.quizzes,
                {
                    question: "",
                    options: [{ label: "" }],
                    correctAnswers: [],
                },
            ],
        }));
    };

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const apiResponse = await getQuizByIdTeacher(id);
                console.log(apiResponse);

                setStatus(apiResponse.status);
                setCloseTime(apiResponse.closeTime);
                setLocation(apiResponse.position);

                setTestData((prevData) => ({
                    ...prevData,
                    testName: apiResponse.name,
                }));

                apiResponse.questions.forEach((quiz) => {
                    setTestData((prevData) => ({
                        ...prevData,
                        quizzes: [
                            ...prevData.quizzes,
                            {
                                question: quiz.label,
                                options: quiz.answers.map((answer) => ({
                                    label: answer.label,
                                })),
                                correctAnswers: [],
                            },
                        ],
                    }));
                });

                apiResponse.key.keys.map((key, index) => {
                    const correctAnswers = key.answers.map((answerIndex) => answerIndex.answerId);

                    console.log(correctAnswers);

                    setTestData((prevData) => {
                        const updatedQuizzes = [...prevData.quizzes];
                        const updatedQuiz = {
                            ...updatedQuizzes[index],
                            correctAnswers: correctAnswers,
                        };
                        updatedQuizzes[index] = updatedQuiz;

                        return {
                            ...prevData,
                            quizzes: updatedQuizzes,
                        };
                    });
                });
            } catch (error) {
                console.error("Failed to fetch question data", error);
            }
        };

        fetchQuiz();
    }, []);

    const handleQuizDelete = (quizIndex) => {
        const updatedQuizzes = testData.quizzes.filter((_, index) => index !== quizIndex);
        setTestData((prevData) => ({
            ...prevData,
            quizzes: updatedQuizzes,
        }));
    };

    const handleTestSubmit = async () => {
        try {
            console.log(testData);

            const requestBody = {
                name: testData.testName,
                position: location,
                status: status,
                closeTime: closeTime ? dayjs(closeTime).toISOString() : undefined,
                questions: testData.quizzes.map((quiz, index) => ({
                    questionId: index,
                    label: quiz.question,
                    answers: quiz.options.map((option, index) => ({
                        answerId: index,
                        label: option.label,
                    })),
                })),
                key: testData.quizzes.map((quiz, questionIndex) => ({
                    questionId: questionIndex,
                    answers: quiz.correctAnswers.map((correctAnswerIndex, index) => ({
                        answerId: index,
                        label: quiz.options[correctAnswerIndex].label,
                    })),
                })),
            };

            console.log(requestBody);
            const response = await updateQuiz(id, requestBody);
            console.log(response);
            message.success("Quiz updated successfully");
            navigate(`/teacher/classes/${option.classId}/quizzes`);
        } catch (error) {
            console.error("Failed to update test", error);
        }
    };

    const handleOpen = (value) => {
        if (value === true) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                });
            });
            setStatus(1);
        } else {
            setLocation(null);
            setStatus(0);
        }
    };

    const handleChangeTime = (value) => {
        setCloseTime(value);
        console.log(value);
    };

    const onOk = (value) => {
        console.log(value);
        setCloseTime(value);
    };

    useEffect(() => {
        console.log(closeTime);
        console.log(dayjs().format("MMMM D, YYYY h:mm A"));
    }, [closeTime]);

    return (
        <div className="test-form">
            <Form form={form} onFinish={handleTestSubmit}>
                <div
                    style={{
                        marginBottom: 10,
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: 30,
                                fontWeight: "bold",
                            }}
                        >
                            Test name
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Input
                                name="testName"
                                value={testData.testName}
                                onChange={(e) =>
                                    setTestData((prevData) => ({
                                        ...prevData,
                                        testName: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        marginBottom: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                paddingRight: 10,
                            }}
                        >
                            Active:
                        </div>
                        <Switch onChange={handleOpen} checked={status} />
                    </div>
                    <div className="datetime-picker">
                        <Space>
                            <div
                                style={{
                                    paddingRight: 10,
                                }}
                            >
                                Close time:
                            </div>
                        </Space>
                        <DatePicker showTime onChange={handleChangeTime} onOk={onOk}></DatePicker>
                    </div>
                </div>

                {testData.quizzes.map((quiz, quizIndex) => (
                    <div className="quiz-container" key={quiz.quizId}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <h3>Question {quizIndex + 1}</h3>
                            <Button
                                style={{
                                    color: "white",
                                    backgroundColor: "red",
                                }}
                                onClick={() => handleQuizDelete(quizIndex)}
                            >
                                Delete Question
                            </Button>
                        </div>
                        <Quiz
                            quizData={quiz}
                            onQuizDataChange={(updatedQuizData) => {
                                const updatedQuizzes = [...testData.quizzes];
                                updatedQuizzes[quizIndex] = updatedQuizData;
                                setTestData((prevData) => ({
                                    ...prevData,
                                    quizzes: updatedQuizzes,
                                }));
                            }}
                        />
                    </div>
                ))}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        type="primary"
                        onClick={handleQuizAdd}
                        style={{
                            color: "white",
                            backgroundColor: "green",
                        }}
                        className="add-quiz-btn"
                    >
                        Add Question
                    </Button>

                    <Button type="primary" htmlType="submit" size="large">
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
};
