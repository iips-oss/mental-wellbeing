import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";

const MobileQuizAttempt = () => {
  const { eventId, quizType } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/quiz/event/${eventId}`);

        const quizzes = Array.isArray(response.data)
          ? response.data
          : [response.data];

        const selectedQuiz = quizzes.find(
          (item) =>
            item.quiz_type?.toUpperCase() === quizType?.toUpperCase()
        );

        if (!selectedQuiz) {
          setError("Quiz not found for this event.");
          return;
        }

        setQuiz(selectedQuiz);
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        setError(
          err.response?.data?.detail || "Failed to load quiz."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [eventId, quizType]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[#386641]">
        Loading quiz...
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-center">
          {error || "Quiz not found."}
        </p>

        <button
          onClick={() => navigate("/student/quizzes")}
          className="bg-[#2E7D4F] text-white px-5 py-2 rounded-lg"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const totalQuestions = questions.length;
  const question = questions[currentQuestion];

  const questionId =
    question?.id || question?.question_id;

  const selectedAnswer = answers[questionId];

  const handleSelectOption = (option) => {
    const optionId = option.id || option.option_id;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = async () => {
    if (!selectedAnswer) {
      setError("Please select an answer before continuing.");
      return;
    }

    setError("");

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      return;
    }

    try {
      setSubmitting(true);

      const response = await API.post("/quiz/submit", {
        quiz_template_id: quiz.quiz_template_id,
        answers,
      });

      navigate(
        `/student/quizzes/${response.data.attempt_id}/results`
      );
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      setError(
        err.response?.data?.detail || "Failed to submit quiz."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrev = () => {
    setError("");

    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const optionColors = [
    "bg-[#E1EAE3]",
    "bg-[#CBE0CF]",
    "bg-[#A3C6AF]",
    "bg-[#CBE0CF]",
    "bg-[#E1EAE3]",
  ];

  return (
    <div className="w-full h-full flex items-center justify-center font-sans relative">
      <div className="bg-[#F3F2F2] rounded-3xl p-6 max-w-2xl w-full shadow-lg relative z-10">
        <h1 className="text-3xl font-semibold tracking-tight text-black font-serif leading-none mb-4">
          Take your time.
        </h1>

        <div className="mb-6">
          <p className="text-sm text-[#9DB1A3] font-semibold tracking-wide uppercase mb-2">
            Question {currentQuestion + 1} / {totalQuestions}
          </p>

          <div className="flex items-center gap-1.5 w-full">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const isPast = i <= currentQuestion;

              return isPast ? (
                <div
                  key={i}
                  className="h-1.5 flex-1 bg-[#F48C6A] rounded-full"
                />
              ) : (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-[#9DB1A3] rounded-full flex-shrink-0"
                />
              );
            })}
          </div>
        </div>

        <h2 className="text-xl font-semibold text-black font-sans mb-8">
          {question?.question_text || question?.text}
        </h2>

        <div className="flex flex-col gap-4 mb-10">
          {(question?.options || []).map((option, index) => {
            const optionId = option.id || option.option_id;
            const isSelected = selectedAnswer === optionId;

            return (
              <button
                key={optionId}
                onClick={() => handleSelectOption(option)}
                className={`w-full min-h-12 ${
                  isSelected
                    ? "bg-[#A3C6AF] ring-2 ring-[#386641]"
                    : optionColors[index % optionColors.length]
                } rounded-xl hover:opacity-80 transition-all cursor-pointer text-left px-4 py-3 text-[#386641] font-medium`}
              >
                {option.option_text || option.text || option.label}
              </button>
            );
          })}
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-black/10">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className={`font-semibold text-sm ${
              currentQuestion === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-black cursor-pointer"
            }`}
          >
            &lt; Previous
          </button>

          <button
            onClick={handleNext}
            disabled={submitting}
            className="bg-[#F48C6A] hover:bg-[#E27655] disabled:opacity-50 text-white px-8 py-2.5 rounded-full font-semibold transition-colors cursor-pointer text-sm shadow-md"
          >
            {submitting
              ? "Submitting..."
              : currentQuestion === totalQuestions - 1
              ? "Submit"
              : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileQuizAttempt;