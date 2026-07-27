import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 12;

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Finished
      navigate("/student/quizzes");
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Mock question
  const questionText = currentQuestion === 2 ? "I feel overwhelmed by my own emotions." : `Question ${currentQuestion} text goes here...`;
  
  // Progress calculation
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full h-full flex items-center justify-center font-sans relative">
      {/* Container for the Quiz Card */}
      <div className="bg-[#F3F2F2] rounded-3xl p-10 max-w-2xl w-full shadow-lg relative z-10">
        <h1 className="text-3xl font-semibold tracking-tight text-black font-serif leading-none mb-4">
          Take your time.
        </h1>
        
        <div className="mb-6">
          <p className="text-sm text-[#9DB1A3] font-semibold tracking-wide uppercase mb-2">
            Question {currentQuestion} / {totalQuestions}
          </p>
          <div className="flex items-center gap-1.5 w-full">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const isPast = i < currentQuestion;
              return isPast ? (
                <div key={i} className="h-1.5 flex-1 bg-[#F48C6A] rounded-full"></div>
              ) : (
                <div key={i} className="w-1.5 h-1.5 bg-[#9DB1A3] rounded-full flex-shrink-0"></div>
              );
            })}
          </div>
        </div>

        <h2 className="text-xl font-semibold text-black font-sans mb-8">
          {questionText}
        </h2>

        <div className="flex flex-col gap-4 mb-10">
          {/* Options */}
          {Array.from({ length: 5 }).map((_, i) => {
            const optionColors = [
              "bg-[#E1EAE3]",
              "bg-[#CBE0CF]",
              "bg-[#A3C6AF]",
              "bg-[#CBE0CF]",
              "bg-[#E1EAE3]"
            ];
            return (
              <button 
                key={i}
                className={`w-full h-12 ${optionColors[i]} rounded-xl hover:opacity-80 transition-colors cursor-pointer text-left px-4 text-[#386641] font-medium`}
              >
                {/* Option text goes here */}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-black/10">
          <button 
            onClick={handlePrev}
            disabled={currentQuestion === 1}
            className={`font-semibold text-sm ${currentQuestion === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-black cursor-pointer'}`}
          >
            &lt; Previous
          </button>
          
          <button 
            onClick={handleNext}
            className="bg-[#F48C6A] hover:bg-[#E27655] text-white px-8 py-2.5 rounded-full font-semibold transition-colors cursor-pointer text-sm shadow-md"
          >
            {currentQuestion === totalQuestions ? "Submit" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;
