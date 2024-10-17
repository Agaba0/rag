const QuizQuestion = ({
  question,
  index,
  userAnswer,
  correctAnswer,
  submitted,
  onAnswerChange,
}) => {
  const renderInputField = () => {
    const { options } = question;

    return options.map((option, i) => (
      <div key={i} className="mb-1">
        <label>
          <input
            type="radio"
            name={`question-${index}`}
            value={option}
            checked={userAnswer === option}
            onChange={() => onAnswerChange(index, option)} 
            className="mr-2"
          />
          {option}
        </label>
      </div>
    ));
  };

  return (
    <div className="mb-4">
      <p>{question.question}</p>
      {renderInputField()}
      {submitted && (
        <div>
          <p>
            <strong>Your Answer:</strong> {userAnswer || "Not answered"}
          </p>
          <p
            className={`font-semibold ${
              userAnswer === correctAnswer ? "text-green-600" : "text-red-600"
            }`}
          >
            <strong>Correct Answer:</strong>
            {Array.isArray(correctAnswer)
              ? correctAnswer.join(", ")
              : correctAnswer}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
