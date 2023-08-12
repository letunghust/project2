import { Button, DatePicker, Form, Input, Space, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { dayjs } from "../../../utils/dayjs.util.js";
import { createQuiz } from "../../../request/quizz.request.js";
import { QuizInput } from "../../../components/Quiz/QuizInput.jsx";

export const CreateQuizTest = () => {
    const [location, setLocation] = useState();
    const option = useSelector((state) => state.option);

    const [closeTime, setCloseTime] = useState();

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

    const handleQuizDelete = (quizIndex) => {
        const updatedQuizzes = testData.quizzes.filter((_, index) => index !== quizIndex);
        setTestData((prevData) => ({
            ...prevData,
            quizzes: updatedQuizzes,
        }));
    };

    const handleTestSubmit = async () => {
        try {
            const requestBody = {
                name: testData.testName,
                classId: parseInt(option.classId),
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
                key: testData.quizzes.map((quiz, index) => ({
                    questionId: index,
                    answers: quiz.correctAnswers.map((correctAnswerIndex, index) => ({
                        answerId: index,
                        label: quiz.options[correctAnswerIndex].label,
                    })),
                })),
            };

            console.log(requestBody);
            const response = await createQuiz(requestBody);
            console.log("Test created!", response.body);
            navigate(`/teacher/classes/${option.classId}/quizzes`);
        } catch (error) {
            console.error("Failed to create test", error);
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
                            <Form.Item>
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
                            </Form.Item>
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
                        <Form.Item>
                            <Switch onChange={handleOpen} />
                        </Form.Item>
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
                        <Form.Item>
                            <DatePicker showTime onChange={handleChangeTime} onOk={onOk}></DatePicker>
                        </Form.Item>
                    </div>
                </div>

                <Form.Item>
                    {testData.quizzes.map((quiz, quizIndex) => {
                        <div>
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
                        </div>;
                    })}
                </Form.Item>

                <Form.Item>
                    <QuizInput />
                </Form.Item>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Form.Item>
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
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large">
                            Submit
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};
