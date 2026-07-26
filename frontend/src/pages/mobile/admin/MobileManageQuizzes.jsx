import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const MobileManageQuizzes = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Upcoming Quizzes");
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const tabs = ["Upcoming Quizzes", "Past Quizzes", "Quiz Types"];

  const quizzes = [
    { id: 1, type: "SCQ", event: "Stress Management Workshop", date: "1 June", description: "Self Concept Questionnaire. Assesses various dimensions of self-concept including physical, social, temperamental, educational, moral, and intellectual self." },
    { id: 2, type: "GWBS", event: "Stress Management Workshop", date: "1 June", description: "General Well-Being Scale. Measures subjective feelings of psychological well-being and distress." },
    { id: 3, type: "TABBPS", event: "Stress Management Workshop", date: "1 June", description: "Type A/B Behaviour Pattern Scale. Helps identify personality traits and susceptibility to stress." },
    { id: 4, type: "EI", event: "Stress Management Workshop", date: "1 June", description: "Emotional Intelligence Scale. Evaluates self-awareness, managing emotions, motivating oneself, empathy, and social skill." },
    { id: 5, type: "GWBS", event: "Stress Management Workshop", date: "30 May", description: "General Well-Being Scale. Measures subjective feelings of psychological well-being and distress." },
  ];

  const quizTypes = [
    {
      id: 1,
      title: "Self Concept (SCQ)",
      subtitle: "48 Questions · 6 Dimensions",
      frequency: "3 Events",
      dateLastTaken: "12 Jul 2026 • 2:00 PM",
    },
    {
      id: 2,
      title: "General Well-Being (GWBS)",
      subtitle: "55 Questions · 4 Dimensions",
      frequency: "2 Events",
      dateLastTaken: "12 Jul 2026 • 2:00 PM",
    },
    {
      id: 3,
      title: "Type A/B Pattern (TABBPS)",
      subtitle: "33 Questions · Form A+B",
      frequency: "1 Event",
      dateLastTaken: "12 Jul 2026 • 2:00 PM",
    },
    {
      id: 4,
      title: "Emotional Intelligence (EI)",
      subtitle: "50 Questions · 5 Competencies",
      frequency: "3 Events",
      dateLastTaken: "12 Jul 2026 • 2:00 PM",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col font-sans relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#386641] font-serif leading-none mb-2">
          Manage Quizzes
        </h1>
        <p className="text-sm text-[#9DB1A3] font-medium">
          Descriptions of all the quizzes
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors cursor-pointer ${activeTab === tab
                ? "bg-[#F3F2F2] border border-[#73D38F] text-[#386641]"
                : "text-[#9DB1A3] hover:text-[#386641]"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#F3F2F2] rounded-3xl p-8 flex-1 overflow-auto">
        {(activeTab === "Upcoming Quizzes" || activeTab === "Past Quizzes") && (
          <div className="flex flex-col h-full">
            {/* Removed table header for mobile card layout */}

            <div className="flex flex-col gap-4 mt-6 overflow-y-auto pr-2 pb-10">
              {quizzes.map((quiz) => (
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
                        onClick={() => {
                          if (activeTab === "Upcoming Quizzes") {
                            setSelectedQuiz(quiz);
                          } else {
                            navigate(`/admin/quizzes/${quiz.id}/results`);
                          }
                        }}
                        className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer w-full text-center"
                      >
                        {activeTab === "Upcoming Quizzes" ? "View Details" : "View Results"}
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Quiz Types" && (
          <div className="flex flex-col h-full">
            {/* Removed table header for mobile card layout */}

            <div className="flex flex-col gap-4 mt-6 overflow-y-auto pr-2 pb-10">
              {quizTypes.map((qt) => (
                  <div
                    key={qt.id}
                    className="flex flex-col gap-2 bg-[#E5E5E5] border border-[#2F3C36] rounded-xl px-5 py-4"
                  >
                    <div className="flex justify-between items-start border-b border-[#2F3C36]/20 pb-2 gap-2">
                      <div>
                        <div className="text-[#3A8458] font-sans font-bold text-lg leading-tight">
                          {qt.title}
                        </div>
                        <div className="text-[#3E4F45] text-xs font-semibold mt-1">
                          {qt.subtitle}
                        </div>
                      </div>
                      <span className="shrink-0 bg-[#2F3C36]/10 px-2 py-1 rounded text-xs font-bold text-[#3E4F45]">
                        {qt.frequency}
                      </span>
                    </div>
                    <div className="text-[#3E4F45] text-sm font-medium mt-1">
                      Last Taken: {qt.dateLastTaken}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedQuiz && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-[#F3F2F2] rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-[#2F3C36]">
            <button
              onClick={() => setSelectedQuiz(null)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-[#386641] font-serif leading-none mb-2">
                Quiz Details
              </h3>
              <p className="text-sm text-[#9DB1A3] font-medium">
                Information about the scheduled quiz
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Quiz Type</h4>
                <div className="text-[#3A8458] font-bold text-lg">{selectedQuiz.type}</div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Event</h4>
                <div className="text-[#3E4F45] font-medium">{selectedQuiz.event}</div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Scheduled Date</h4>
                <div className="text-[#3E4F45] font-medium">{selectedQuiz.date}</div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Description</h4>
                <div className="text-[#3E4F45] text-sm leading-relaxed">
                  {selectedQuiz.description}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedQuiz(null)}
                className="bg-[#2E7D4F] hover:bg-[#256641] text-white px-6 py-2.5 rounded-lg font-medium transition-colors cursor-pointer text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileManageQuizzes;
