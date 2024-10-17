import { useContext, useState } from "react";
import { FileContext } from "./fileContext";
import { generateQuestion } from "./ai";
import QuizQuestion from "./quizeQuestion";

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
      example: 1) what is a noun? a) name of person, animal, place or things. b) nothing. c) all of the above. answer:  name of person, animal, place or things.  2) what is a verb? a) an action  b) Habibu. c) Her. animal, place or things., answer: an action , etc do not add ** in either the question or answer`;
      const generatedQuiz = await generateQuestion(prompt);
      const parsedQuiz = parseQuiz(generatedQuiz);
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
    let currentAnswer = null;

    quizText.split("\n").forEach((line) => {
      line = line.trim();
      if (!line) return;

      const questionMatch = line.match(/^\d+\)\s*(.*\?)$/);
      if (questionMatch) {
        if (currentQuestion) {
          questions.push({
            type: "objective",
            question: currentQuestion,
            options: currentOptions,
            answer: currentAnswer,
          });
        }
        currentQuestion = questionMatch[1].trim();
        currentOptions = [];
        currentAnswer = null; 
        return;
      }

      const optionMatch = line.match(/^[a-z]\)\s+(.*)$/i);
      if (optionMatch) {
        currentOptions.push(optionMatch[1].trim());
        return;
      }

      const answerMatch = line.match(/^\s*Answer:\s*(.*)$/);
      if (answerMatch) {
        currentAnswer = answerMatch[1].trim(); 
      }
    });

    if (currentQuestion) {
      questions.push({
        type: "objective",
        question: currentQuestion,
        options: currentOptions,
        answer: currentAnswer, 
      });
    }

    return questions;
  };

  const normalizeAnswer = (answer) => {
    return answer.replace(/^[a-z]\)\s*/i, "").trim();
  };

  const handleSubmit = () => {
    let totalScore = 0;
    const results = quizQuestions.map((q, index) => {
      const correctAnswer = normalizeAnswer(q.answer);
      const userSelection = userAnswers[index]
        ? normalizeAnswer(userAnswers[index])
        : "";

      if (userSelection === correctAnswer) {
        totalScore += 5; 
        return {
          question: q.question,
          userAnswer: userSelection,
          correct: true,
        };
      } else {
        return {
          question: q.question,
          userAnswer: userSelection || "Not answered",
          correct: false,
          correctAnswer,
        };
      }
    });

    setScore(totalScore);
  };

  const handleAnswerChange = (index, answer) => {
    setUserAnswers((prevAnswers) => ({ ...prevAnswers, [index]: answer }));
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Quizzes</h1>
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <p className="text-lg">
        Lets see how much knowledge you have gained so far
        </p>
        <p className="text-lg font-semibold mt-2">
Goodluck
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Quiz</h2>
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
                correctAnswer={q.answer}
                submitted={score !== null}
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
                  Your Score: {score} / {quizQuestions.length * 5}{" "}
                </h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
