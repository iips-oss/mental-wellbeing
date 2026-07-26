import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MobileStudentQuizzes = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Attempted");
  const tabs = ["Attempted", "Upcoming"];

  const attemptedQuizzes = [
    { id: 1, type: "SCQ", event: "Stress Management Workshop", date: "1 June", result: "View Results" },
    { id: 2, type: "GWBS", event: "Stress Management Workshop", date: "1 June", result: "View Results" },
    { id: 3, type: "TABBPS", event: "Stress Management Workshop", date: "1 June", result: "View Results" },
    { id: 4, type: "EI", event: "Stress Management Workshop", date: "1 June", result: "View Results" },
    { id: 5, type: "GWBS", event: "Stress Management Workshop", date: "30 May", result: "View Results" },
  ];

  const upcomingQuizzes = [
    { id: 6, type: "SCQ", event: "Stress Management Workshop", date: "1 June", action: "Attempt" },
    { id: 7, type: "GWBS", event: "Stress Management Workshop", date: "2 June", action: null },
    { id: 8, type: "TABBPS", event: "Stress Management Workshop", date: "2 June", action: null },
    { id: 9, type: "EI", event: "Stress Management Workshop", date: "3 June", action: null },
    { id: 10, type: "GWBS", event: "Stress Management Workshop", date: "30 June", action: null },
  ];

  return (
    <div className="w-full h-full flex flex-col font-sans relative">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[#386641] font-serif leading-none mb-2">
          My Quizzes
        </h1>
        <p className="text-sm text-[#9DB1A3] font-medium">
          Retake quizzes to improve results
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors cursor-pointer ${
              activeTab === tab
                ? "bg-[#F3F2F2] border border-[#73D38F] text-[#386641]"
                : "text-[#9DB1A3] hover:text-[#386641]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#F3F2F2] rounded-3xl p-8 flex-1 overflow-auto">
        <div className="flex flex-col h-full">
          {/* Removed table header for mobile layout */}
          <div className="flex flex-col gap-4 mt-6 overflow-y-auto pr-2 pb-10">
            {activeTab === "Attempted" &&
              attemptedQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex flex-col gap-2 bg-[#E5E5E5] border border-[#2F3C36] rounded-xl px-5 py-4"
                >
                  <div className="flex justify-between items-center border-b border-[#2F3C36]/20 pb-2">
                    <span className="text-[#3A8458] font-sans font-bold text-lg">
                      {quiz.type}
                    </span>
                    <span className="text-[#3E4F45] text-xs font-semibold bg-[#2F3C36]/10 px-2 py-1 rounded">
                      {quiz.date}
                    </span>
                  </div>
                  <div className="text-[#3E4F45] text-sm font-medium mt-1">
                    Event: {quiz.event}
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => navigate(`/student/quizzes/${quiz.id}/results`)}
                      className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer w-full text-center"
                    >
                      {quiz.result}
                    </button>
                  </div>
                </div>
              ))}

            {activeTab === "Upcoming" &&
              upcomingQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex flex-col gap-2 bg-[#E5E5E5] border border-[#2F3C36] rounded-xl px-5 py-4"
                >
                  <div className="flex justify-between items-center border-b border-[#2F3C36]/20 pb-2">
                    <span className="text-[#3A8458] font-sans font-bold text-lg">
                      {quiz.type}
                    </span>
                    <span className="text-[#3E4F45] text-xs font-semibold bg-[#2F3C36]/10 px-2 py-1 rounded">
                      {quiz.date}
                    </span>
                  </div>
                  <div className="text-[#3E4F45] text-sm font-medium mt-1">
                    Event: {quiz.event}
                  </div>
                  <div className="flex justify-end mt-2">
                    {quiz.action ? (
                      <button
                        onClick={() => navigate(`/student/quizzes/${quiz.id}/attempt`)}
                        className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer w-full text-center"
                      >
                        {quiz.action}
                      </button>
                    ) : (
                      <div className="text-xs text-gray-500 italic py-2">Not available yet</div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileStudentQuizzes;
