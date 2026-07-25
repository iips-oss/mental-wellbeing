import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import AuthService from "../../services/auth";

const QUIZ_NAME_MAP = {
  SCQ: "Self Concept Questionnaire (SCQ)",
  GWBS: "General Well-Being Scale (GWBS)",
  TABBPS: "Type A/B Behaviour Pattern (TABBPS)",
  EI: "Emotional Intelligence (EI)"
};

// Fixed metadata about each instrument itself (question count, dimensions) —
// this is a property of the quiz design, not something that comes from the DB.
const QUIZ_TYPE_META = {
  SCQ: { title: "Self Concept (SCQ)", subtitle: "48 Questions · 6 Dimensions" },
  GWBS: { title: "General Well-Being (GWBS)", subtitle: "55 Questions · 4 Dimensions" },
  TABBPS: { title: "Type A/B Pattern (TABBPS)", subtitle: "33 Questions · Form A+B" },
  EI: { title: "Emotional Intelligence (EI)", subtitle: "50 Questions · 5 Competencies" }
};

const ManageQuizzes = () => {
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
        const events = await AuthService.getAdminEvents();

        // For each event, fetch its assigned QuizTemplate rows and flatten
        // into one list of { quiz + event } records for this table.
        const perEventResults = await Promise.all(
          events.map(async (event) => {
            try {
              const eventQuizzes = await AuthService.getEventQuizzes(event.id);
              return eventQuizzes.map((q) => ({
                quizTemplateId: q.id,
                quiz_type: q.quiz_type,
                title: q.title,
                eventId: event.id,
                eventTitle: event.title,
                eventDate: event.event_date,
                eventTime: event.event_time,
                eventStatus: event.status
              }));
            } catch (err) {
              console.error(`Failed to load quizzes for event ${event.id}:`, err);
              return [];
            }
          })
        );

        setQuizzes(perEventResults.flat());
      } catch (err) {
        console.error("Failed to load events/quizzes:", err);
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

  // Group the already-fetched quiz records by quiz_type to build the
  // "Quiz Types" tab summary — no extra backend call needed.
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
      ...QUIZ_TYPE_META[quizType],
      eventCount,
      lastTaken
    };
  });

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
            <div className="grid grid-cols-4 gap-4 px-6 pb-4 border-b border-black/10 font-serif font-semibold text-black">
              <div>Quiz Type</div>
              <div className="text-center">Event</div>
              <div className="text-center">Date</div>
              <div className="text-right pr-6"></div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#386641]"></div>
                <p className="text-gray-500 font-medium">Loading quizzes...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 text-red-600 font-semibold">{error}</div>
            ) : displayedQuizzes.length === 0 ? (
              <div className="text-center py-16 text-gray-400 font-sans font-semibold">
                No {activeTab.toLowerCase()} found.
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-6 overflow-y-auto pr-2 pb-10">
                {displayedQuizzes.map((quiz) => (
                  <div
                    key={quiz.quizTemplateId}
                    className="grid grid-cols-4 gap-4 items-center bg-[#E5E5E5] border border-[#2F3C36] rounded-xl px-6 py-4"
                  >
                    <div className="text-[#3A8458] font-sans font-medium text-lg">
                      {quiz.quiz_type}
                    </div>
                    <div className="text-center text-[#3E4F45] text-sm">
                      {quiz.eventTitle}
                    </div>
                    <div className="text-center text-[#3E4F45] text-sm">
                      {formatDate(quiz.eventDate)}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          if (activeTab === "Upcoming Quizzes") {
                            setSelectedQuiz(quiz);
                          } else {
                            navigate(
                              `/admin/quizzes/${quiz.quizTemplateId}/results?eventId=${quiz.eventId}&quizType=${quiz.quiz_type}`
                            );
                          }
                        }}
                        className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
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
            <div className="grid grid-cols-3 gap-4 px-6 pb-4 border-b border-black/10 font-serif font-semibold text-black">
              <div>Quiz Type</div>
              <div className="text-center">Frequency</div>
              <div className="text-right">Date Last Taken</div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#386641]"></div>
                <p className="text-gray-500 font-medium">Loading quiz types...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 text-red-600 font-semibold">{error}</div>
            ) : (
              <div className="flex flex-col gap-4 mt-6 overflow-y-auto pr-2 pb-10">
                {quizTypeSummaries.map((qt) => (
                  <div
                    key={qt.quizType}
                    className="grid grid-cols-3 gap-4 items-center bg-[#E5E5E5] border border-[#2F3C36] rounded-xl px-6 py-4"
                  >
                    <div>
                      <div className="text-[#3A8458] font-sans font-medium text-lg">
                        {qt.title}
                      </div>
                      <div className="text-[#3E4F45] text-xs mt-1">
                        {qt.subtitle}
                      </div>
                    </div>
                    <div className="text-center text-[#3E4F45] text-sm">
                      {qt.eventCount} {qt.eventCount === 1 ? "Event" : "Events"}
                    </div>
                    <div className="text-right text-[#3E4F45] text-sm pr-4">
                      {qt.lastTaken
                        ? `${formatDate(qt.lastTaken.eventDate)} • ${formatTime(qt.lastTaken.eventTime)}`
                        : "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <div className="text-[#3E4F45] font-medium">{selectedQuiz.eventTitle}</div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Scheduled Date</h4>
                <div className="text-[#3E4F45] font-medium">{formatDate(selectedQuiz.eventDate)}</div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Title</h4>
                <div className="text-[#3E4F45] text-sm leading-relaxed">
                  {selectedQuiz.title || "—"}
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

export default ManageQuizzes;
