import { Button } from "antd";
import { Quiz } from "../Question.jsx";
import { useState } from "react";

export const QuizInput = ({ value }) => {
    const [testData, setTestData] = useState(
        value
            ? value
            : {
                  testName: "",
                  classId: "",
                  quizzes: [],
              }
    );

    const handleQuizDelete = (quizIndex) => {
        const updatedQuizzes = testData.quizzes.filter((_, index) => index !== quizIndex);
        setTestData((prevData) => ({
            ...prevData,
            quizzes: updatedQuizzes,
        }));
    };

    return (
        <div>
            {testData.quizzes.map((quiz, quizIndex) => (
                <div className="quiz-container" key={quiz.quizId}>
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
        </div>
    );
};
