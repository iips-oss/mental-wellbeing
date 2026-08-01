import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const StudentQuizzes = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Attempted");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = ["Attempted", "Available"];

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError("");

        const rsvpResponse = await API.get("/student/rsvps");
        const events = rsvpResponse.data;

        const requests = events.map(async (event) => {
          const response = await API.get(
            `/student/events/${event.id}/quizzes`
          );

          return response.data.map((quiz) => ({
            ...quiz,
            event_id: event.id,
            event: event.title,
            date: event.event_date,
            event_status: event.status,
          }));
        });

        const results = await Promise.all(requests);
        setQuizzes(results.flat());
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        setError(
          err.response?.data?.detail || "Failed to load quizzes."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });
  };

  const attemptedQuizzes = quizzes.filter(
    (quiz) => quiz.status === "submitted"
  );

  const availableQuizzes = quizzes.filter(
    (quiz) => quiz.status === "available"
  );

  const displayedQuizzes =
    activeTab === "Attempted"
      ? attemptedQuizzes
      : availableQuizzes;

  const handleAttempt = (quiz) => {
    navigate(
      `/student/quizzes/${quiz.event_id}/${quiz.quiz_type}/attempt`
    );
  };

  const handleViewResults = (quiz) => {
    if (!quiz.attempt_id) return;

    navigate(
      `/student/quizzes/${quiz.attempt_id}/results`
    );
  };

  return (
    <div className="w-full h-full flex flex-col font-sans relative">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[#386641] font-serif leading-none mb-2">
          My Quizzes
        </h1>
        <p className="text-sm text-[#9DB1A3] font-medium">
          View completed quizzes and available assessments
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
          <div className="grid grid-cols-4 gap-4 px-6 pb-4 border-b border-black/10 font-serif font-semibold text-black">
            <div>Quiz Type</div>
            <div className="text-center">Event</div>
            <div className="text-center">Date</div>
            <div className="text-right pr-6">
              {activeTab === "Attempted" ? "Result" : "Action"}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6 overflow-y-auto pr-2 pb-10">
            {loading && (
              <div className="text-center text-[#9DB1A3] py-10">
                Loading quizzes...
              </div>
            )}

            {!loading && error && (
              <div className="text-center text-red-500 py-10">
                {error}
              </div>
            )}

            {!loading && !error && displayedQuizzes.length === 0 && (
              <div className="text-center text-[#9DB1A3] py-10">
                No {activeTab.toLowerCase()} quizzes found.
              </div>
            )}

            {!loading &&
              !error &&
              displayedQuizzes.map((quiz) => (
                <div
                  key={`${quiz.event_id}-${quiz.quiz_template_id}`}
                  className="grid grid-cols-4 gap-4 items-center bg-[#E5E5E5] border border-[#2F3C36] rounded-xl px-6 py-4"
                >
                  <div className="text-[#3A8458] font-sans font-medium text-lg">
                    {quiz.quiz_type}
                  </div>

                  <div className="text-center text-[#3E4F45] text-sm">
                    {quiz.event}
                  </div>

                  <div className="text-center text-[#3E4F45] text-sm">
                    {formatDate(quiz.date)}
                  </div>

                  <div className="flex justify-end">
                    {quiz.status === "submitted" ? (
                      <button
                        onClick={() => handleViewResults(quiz)}
                        className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        View Results
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAttempt(quiz)}
                        className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Attempt
                      </button>
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

export default StudentQuizzes;