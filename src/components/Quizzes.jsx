import { useContext, useState } from "react";
import { FileContext } from "./fileContext";
import { generateQuestion } from "./ai";

const QuizQuestion = ({ question, index, userAnswer, onAnswerChange }) => {
  const renderInputField = () => {
    const { type, options } = question;

    switch (type) {
      case "objective": // Single choice
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
      case "multiple": // Multiple choice
        return options.map((option, i) => (
          <div key={i} className="mb-1">
            <label>
              <input
                type="checkbox"
                name={`question-${index}`}
                value={option}
                checked={
                  Array.isArray(userAnswer) && userAnswer.includes(option)
                }
                onChange={(e) => {
                  const updatedAnswers = Array.isArray(userAnswer)
                    ? [...userAnswer]
                    : [];
                  if (e.target.checked) {
                    updatedAnswers.push(option);
                  } else {
                    const optionIndex = updatedAnswers.indexOf(option);
                    if (optionIndex > -1) {
                      updatedAnswers.splice(optionIndex, 1);
                    }
                  }
                  onAnswerChange(index, updatedAnswers);
                }}
                className="mr-2"
              />
              {option}
            </label>
          </div>
        ));
      case "fill-in-the-blank": // Text input
      default:
        return (
          <input
            type="text"
            value={userAnswer || ""}
            onChange={(e) => onAnswerChange(index, e.target.value)}
            className="border rounded p-2 w-full"
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <p>{question.question}</p>
      {renderInputField()}
    </div>
  );
};

const Quizzes = () => {
  const { fileContent } = useContext(FileContext);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  const handleStartQuiz = async () => {
    if (!fileContent) {
      alert(
        "No file content available. Please upload a file on the Dashboard."
      );
      return;
    }

    setLoading(true);
    try {
      const prompt = `Generate quiz questions based on the following content:\n\n${fileContent}. 
      Format: just go straight to the questions without any introduction, it should be objectives questions
      schema: what is a noun? a) name of person, animal, place or things. b) nothing. c) all of the above.`;
      const generatedQuiz = await generateQuestion(prompt);
      const parsedQuiz = parseQuiz(generatedQuiz);
      console.log(parsedQuiz);
      setQuizQuestions(parsedQuiz);
      setUserAnswers({});
      setScore(null);
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("An error occurred while generating the quiz.");
    } finally {
      setLoading(false);
    }
  };

  const parseQuiz = (quizText) => {
    const questions = [];
    let currentQuestion = null;
    let currentOptions = [];

    quizText.split("\n").forEach((line) => {
      line = line.trim();
      if (!line) return;

      const questionMatch = line.match(/^\d+\.\s*(.*\?)$/);
      if (questionMatch) {
        if (currentQuestion) {
          questions.push({
            type: "objective",
            question: currentQuestion,
            options: currentOptions,
          });
        }
        currentQuestion = questionMatch[1].trim();
        currentOptions = [];
        return;
      }

      const optionMatch = line.match(/^[a-z]\)\s+(.*)$/i);
      if (optionMatch) {
        currentOptions.push(optionMatch[1].trim());
        return;
      }
    });

    if (currentQuestion) {
      questions.push({
        type: "objective",
        question: currentQuestion,
        options: currentOptions,
        answer: answer,
      });
    }

    return questions;
  };

  const handleAnswerChange = (index, answer) => {
    setUserAnswers((prevAnswers) => ({ ...prevAnswers, [index]: answer }));
  };

  const handleSubmit = () => {
    let totalScore = 0;
    quizQuestions.forEach((q, index) => {
      const correctAnswer = Array.isArray(q.answer) ? q.answer : [q.answer];
      const userSelection = Array.isArray(userAnswers[index])
        ? userAnswers[index]
        : [];
      if (
        userSelection.length === correctAnswer.length &&
        correctAnswer.every((ans) => userSelection.includes(ans))
      ) {
        totalScore += 10;
      } else if (userAnswers[index]?.trim() === q.answer) {
        totalScore += 10;
      }
    });
    setScore(totalScore);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Quizzes</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Quiz</h2>
        <p className="mt-2">Test your knowledge on the uploaded document.</p>
        <button
          onClick={handleStartQuiz}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          disabled={loading}
        >
          {loading ? "Generating Quiz..." : "Start Quiz"}
        </button>

        {quizQuestions.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-bold">Answer the Questions:</h2>
            {quizQuestions.map((q, index) => (
              <QuizQuestion
                key={index}
                question={q}
                index={index}
                userAnswer={userAnswers[index]}
                onAnswerChange={handleAnswerChange}
              />
            ))}
            <button
              onClick={handleSubmit}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Submit Answers
            </button>
            {score !== null && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">
                  Your Score: {score} / {quizQuestions.length * 10}
                </h3>
                <h4 className="font-semibold">Review Your Answers:</h4>
                {quizQuestions.map((q, index) => (
                  <div key={index} className="mb-2">
                    <p>
                      <strong>Question:</strong> {q.question}
                    </p>
                    <p>
                      <strong>Your Answer:</strong>{" "}
                      {userAnswers[index] || "Not answered"}
                    </p>
                    <p
                      className={`font-semibold ${
                        userAnswers[index] === q.answer
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <strong>Correct Answer:</strong>{" "}
                      {Array.isArray(q.answer) ? q.answer.join(", ") : q.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
