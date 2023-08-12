import React from "react";
import "../assets/styles/quizStyle.css";
import { Button, Checkbox, Input } from "antd";
import { AiFillDelete } from "react-icons/ai";

export const Quiz = ({ quizData, onQuizDataChange }) => {
  const handleAnswerChange = (optionIndex) => {
    const isChecked = quizData.correctAnswers.includes(optionIndex);
    let newCorrectAnswers;

    if (isChecked) {
      newCorrectAnswers = quizData.correctAnswers.filter(
        (index) => index !== optionIndex
      );
    } else {
      newCorrectAnswers = [...quizData.correctAnswers, optionIndex];
    }

    const updatedQuizData = {
      ...quizData,
      correctAnswers: newCorrectAnswers,
    };

    onQuizDataChange(updatedQuizData);
  };

  const handleOptionChange = (optionIndex, e) => {
    const newOptions = [...quizData.options];
    newOptions[optionIndex] = {
      answerId: optionIndex,
      label: e.target.value,
    };

    const updatedQuizData = {
      ...quizData,
      options: newOptions,
    };

    onQuizDataChange(updatedQuizData);
  };

  const handleAddOption = () => {
    const updatedOptions = [...quizData.options, { answerId: null, label: "" }];

    const updatedQuizData = {
      ...quizData,
      options: updatedOptions,
    };

    onQuizDataChange(updatedQuizData);
  };

  const handleDeleteOption = (optionIndex) => {
    const newOptions = [...quizData.options];
    newOptions.splice(optionIndex, 1);

    const newCorrectAnswers = quizData.correctAnswers.filter(
      (index) => index !== optionIndex
    );

    // Update the index values of correctAnswers array
    const updatedCorrectAnswers = newCorrectAnswers.map((index) =>
      index > optionIndex ? index - 1 : index
    );

    const updatedQuizData = {
      ...quizData,
      options: newOptions,
      correctAnswers: updatedCorrectAnswers,
    };

    onQuizDataChange(updatedQuizData);
  };

  return (
    <div>
      <div>
        <div>Question:</div>
        <Input
          name="question"
          value={quizData.question}
          onChange={(e) =>
            onQuizDataChange({
              ...quizData,
              question: e.target.value,
            })
          }
          style={{
            width: "99%",
            marginBottom: 10,
          }}
        />
      </div>
      {quizData.options.map((option, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            className="key-answer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "94%",
            }}
          >
            {/* Updated Checkbox component */}
            <Checkbox
              value={index}
              checked={quizData.correctAnswers.includes(index)}
              onChange={() => handleAnswerChange(index)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                direction: "column",
                paddingRight: 5,
              }}
            />
            <Input
              value={option.label}
              onChange={(e) => handleOptionChange(index, e)}
              style={{
                height: 30,
                marginBottom: 10,
                minWidth: "90%",
              }}
            />
          </div>
          <AiFillDelete size={24} onClick={() => handleDeleteOption(index)} />
        </div>
      ))}
      <Button type="primary" onClick={handleAddOption}>
        Add Option
      </Button>
    </div>
  );
};
