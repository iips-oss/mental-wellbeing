import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import AuthService from "../../../services/auth";

const QUIZ_TYPE_META = {
  SCQ: { title: "Self Concept (SCQ)", subtitle: "48 Questions · 6 Dimensions" },
  GWBS: { title: "General Well-Being (GWBS)", subtitle: "55 Questions · 4 Dimensions" },
  TABBPS: { title: "Type A/B Pattern (TABBPS)", subtitle: "33 Questions · Form A+B" },
  EI: { title: "Emotional Intelligence (EI)", subtitle: "50 Questions · 5 Competencies" }
};

const MobileManageQuizzes = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Upcoming Quizzes");
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = ["Upcoming Quizzes", "Past Quizzes", "Quiz Types"];

  useEffect(() => {
    const fetchAllQuizzes = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await AuthService.getAllQuizTemplates();
        setQuizzes(data || []);
      } catch (err) {
        console.error("Failed to load quizzes:", err);
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllQuizzes();
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  const isPast = (q) =>
    q.eventStatus === "completed" ||
    q.eventStatus === "closed" ||
    q.eventStatus === "cancelled" ||
    q.eventDate < todayStr;

  const upcomingQuizzes = quizzes.filter((q) => !isPast(q));
  const pastQuizzes = quizzes.filter((q) => isPast(q));

  const displayedQuizzes = activeTab === "Past Quizzes" ? pastQuizzes : upcomingQuizzes;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(h, 10));
    date.setMinutes(parseInt(m, 10));
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const quizTypeSummaries = Object.keys(QUIZ_TYPE_META).map((quizType) => {
    const matches = quizzes.filter((q) => q.quiz_type === quizType);
    const eventCount = matches.length;

    let lastTaken = null;
    for (const q of matches) {
      if (!lastTaken || q.eventDate > lastTaken.eventDate) {
        lastTaken = q;
      }
    }

    return {
      quizType,
      title: QUIZ_TYPE_META[quizType].title,
      subtitle: QUIZ_TYPE_META[quizType].subtitle,
      eventCount,
      lastTakenDate: lastTaken ? formatDate(lastTaken.eventDate) : "—",
      lastTakenTime: lastTaken ? formatTime(lastTaken.eventTime) : ""
    };
  });

  if (loading) {
    return (
      <div className="p-8 flex flex-col justify-center items-center h-full gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#386641]"></div>
        <p className="text-gray-500 font-medium">Loading quizzes list...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col font-sans relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#386641] font-serif leading-none mb-2">
          Manage Quizzes
        </h1>
        <p className="text-sm text-[#9DB1A3] font-medium">
          Descriptions and status of all quizzes across events
        </p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors cursor-pointer shrink-0 ${
              activeTab === tab
                ? "bg-[#F3F2F2] border border-[#73D38F] text-[#386641]"
                : "text-[#9DB1A3] hover:text-[#386641]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100 font-semibold">
          {error}
        </div>
      )}

      <div className="bg-[#F3F2F2] rounded-3xl p-8 flex-1 overflow-auto">
        {(activeTab === "Upcoming Quizzes" || activeTab === "Past Quizzes") && (
          <div className="flex flex-col h-full">
            {displayedQuizzes.length === 0 ? (
              <div className="text-center py-16 text-gray-400 font-sans font-semibold">
                No {activeTab.toLowerCase()} found.
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-2 overflow-y-auto pr-2 pb-10">
                {displayedQuizzes.map((quiz) => (
                  <div
                    key={`${quiz.id}-${quiz.event_id}`}
                    className="flex flex-col gap-2 bg-[#E5E5E5] border border-[#2F3C36] rounded-xl px-5 py-4"
                  >
                    <div className="flex justify-between items-center border-b border-[#2F3C36]/20 pb-2">
                      <span className="text-[#3A8458] font-sans font-bold text-lg">
                        {quiz.quiz_type}
                      </span>
                      <span className="text-[#3E4F45] text-xs font-semibold bg-[#2F3C36]/10 px-2 py-1 rounded">
                        {formatDate(quiz.eventDate)}
                      </span>
                    </div>
                    <div className="text-[#3E4F45] text-sm font-medium mt-1">
                      Event: {quiz.eventName || "—"}
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => {
                          if (activeTab === "Upcoming Quizzes") {
                            setSelectedQuiz(quiz);
                          } else {
                            navigate(
                              `/admin/quizzes/${quiz.id}/results?eventId=${quiz.event_id}&quizType=${quiz.quiz_type}`
                            );
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
            )}
          </div>
        )}

        {activeTab === "Quiz Types" && (
          <div className="flex flex-col h-full">
            <div className="flex flex-col gap-4 mt-2 overflow-y-auto pr-2 pb-10">
              {quizTypeSummaries.map((qt) => (
                <div
                  key={qt.quizType}
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
                      {qt.eventCount} Event{qt.eventCount === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="text-[#3E4F45] text-sm font-medium mt-1">
                    Last Taken: {qt.lastTakenDate} {qt.lastTakenTime ? `• ${qt.lastTakenTime}` : ""}
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
                <div className="text-[#3A8458] font-bold text-lg">{selectedQuiz.quiz_type}</div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Event</h4>
                <div className="text-[#3E4F45] font-medium">{selectedQuiz.eventName || "—"}</div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Scheduled Date</h4>
                <div className="text-[#3E4F45] font-medium">
                  {formatDate(selectedQuiz.eventDate)} {selectedQuiz.eventTime ? `• ${formatTime(selectedQuiz.eventTime)}` : ""}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Description</h4>
                <div className="text-[#3E4F45] text-sm leading-relaxed">
                  {selectedQuiz.description || "No description provided."}
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
