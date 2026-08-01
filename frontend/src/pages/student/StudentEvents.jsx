import React, { useState, useEffect } from "react";
import { MapPin, X, Save, FileText, CheckCircle2, ArrowRight, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StudentService from "../../services/student";

const StudentEvents = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Active Events");
  const [events, setEvents] = useState([]);
  const [rsvpedEventIds, setRsvpedEventIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventQuizzes, setEventQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const [rsvping, setRsvping] = useState(false);

  const tabs = ["Active Events", "Past Events"];

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(h, 10));
    date.setMinutes(parseInt(m, 10));
    return date.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const fetchEventsAndRsvps = async () => {
    try {
      setLoading(true);
      setError("");

      const [allEvents, rsvps] = await Promise.all([
        StudentService.getEvents(),
        StudentService.getMyRsvps(),
      ]);

      setEvents(allEvents || []);
      const rsvpSet = new Set((rsvps || []).map((r) => String(r.id)));
      setRsvpedEventIds(rsvpSet);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError(err.response?.data?.detail || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsAndRsvps();
  }, []);

  const activeEvents = events.filter((e) => e.status === "scheduled" || e.status === "ongoing");
  const pastEvents = events.filter((e) => e.status === "completed" || e.status === "closed");
  const currentEvents = activeTab === "Active Events" ? activeEvents : pastEvents;

  const handleOpenModal = async (event) => {
    setSelectedEvent(event);
    setNotesInput(event.saved_notes || "");
    setEventQuizzes([]);
    setLoadingQuizzes(true);

    const isRsvped = rsvpedEventIds.has(String(event.id));

    if (isRsvped) {
      try {
        const quizzes = await StudentService.getEventQuizzesForStudent(event.id);
        setEventQuizzes(quizzes || []);
      } catch (err) {
        console.error("Failed to load event quizzes:", err);
      } finally {
        setLoadingQuizzes(false);
      }
    } else {
      setLoadingQuizzes(false);
    }
  };

  const handleRsvp = async (eventId) => {
    try {
      setRsvping(true);
      await StudentService.rsvpEvent(eventId);
      
      const rsvps = await StudentService.getMyRsvps();
      const rsvpSet = new Set((rsvps || []).map((r) => String(r.id)));
      setRsvpedEventIds(rsvpSet);

      if (selectedEvent && String(selectedEvent.id) === String(eventId)) {
        const quizzes = await StudentService.getEventQuizzesForStudent(eventId);
        setEventQuizzes(quizzes || []);
      }
    } catch (err) {
      console.error("RSVP failed:", err);
      alert(err.response?.data?.detail || "RSVP failed. Please try again.");
    } finally {
      setRsvping(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-sans relative">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[#386641] font-serif leading-none mb-2">
          Events & Workshops
        </h1>
        <p className="text-sm text-[#9DB1A3] font-medium">
          Register for wellbeing activities and complete assessments
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
          <div className="grid grid-cols-12 gap-4 px-6 pb-4 border-b border-black/10 font-serif font-semibold text-black">
            <div className="col-span-5">Event</div>
            <div className="col-span-2 text-center">Quizzes</div>
            <div className="col-span-3 text-center">Date</div>
            <div className="col-span-2 text-right pr-6">Details</div>
          </div>

          <div className="flex flex-col gap-4 mt-6 overflow-y-auto pr-2 pb-10">
            {loading && (
              <div className="text-center text-[#9DB1A3] py-10 font-medium">
                Loading events...
              </div>
            )}

            {!loading && error && (
              <div className="text-center text-red-500 py-10 font-medium">
                {error}
              </div>
            )}

            {!loading && !error && currentEvents.map((event) => {
              const isRsvped = rsvpedEventIds.has(String(event.id));

              return (
                <div
                  key={event.id}
                  className="grid grid-cols-12 gap-4 items-center bg-[#E5E5E5] border border-[#2F3C36] rounded-xl px-6 py-4"
                >
                  <div className="col-span-5">
                    <div className="text-[#3A8458] font-sans font-medium text-lg truncate pr-2 flex items-center gap-2">
                      {event.title}
                      {isRsvped && (
                        <span className="text-[10px] bg-[#3A8458] text-white px-2 py-0.5 rounded-full font-semibold">
                          RSVPed
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-center text-[#3E4F45] text-sm font-semibold">
                    {event.quizzes_count ?? (event.quizzes ? event.quizzes.length : 0)}
                  </div>

                  <div className="col-span-3 text-center flex items-center justify-center gap-1 text-[#3E4F45] text-sm font-medium">
                    {new Date(event.event_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })} • {formatTime(event.event_time)}
                  </div>

                  <div className="col-span-2 flex justify-end gap-2">
                    {!isRsvped && activeTab === "Active Events" && (
                      <button
                        onClick={() => handleRsvp(event.id)}
                        disabled={rsvping}
                        className="bg-[#386641] hover:bg-[#2e5335] text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        RSVP
                      </button>
                    )}
                    <button 
                      onClick={() => handleOpenModal(event)}
                      className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
            {!loading && !error && currentEvents.length === 0 && (
              <div className="text-center text-gray-500 font-medium py-8">
                No events found in this category.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-[#F3F2F2] rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-[#2F3C36] max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 shrink-0">
              <h3 className="text-2xl font-semibold text-[#386641] font-serif leading-none mb-2">
                Event Details
              </h3>
            </div>

            <div className="space-y-6 overflow-y-auto pr-2 pb-4 flex-1">
              {/* Event Info */}
              <div>
                <h4 className="text-xs font-semibold text-[#9DB1A3] tracking-wider uppercase mb-1">Event</h4>
                <div className="text-[#3A8458] font-semibold text-lg">{selectedEvent.title}</div>
                <div className="text-[#3E4F45] text-sm mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> {selectedEvent.venue}
                </div>
              </div>

              {/* RSVP status banner */}
              {!rsvpedEventIds.has(String(selectedEvent.id)) && (
                <div className="bg-[#FFF5E5] border border-[#F5A623]/30 rounded-xl p-4 flex items-center justify-between">
                  <div className="text-xs text-[#8A7B52] font-semibold">
                    You have not registered for this event yet.
                  </div>
                  <button
                    onClick={() => handleRsvp(selectedEvent.id)}
                    disabled={rsvping}
                    className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    RSVP Now
                  </button>
                </div>
              )}

              {/* Quizzes Section */}
              <div>
                <h4 className="text-xs font-semibold text-[#9DB1A3] tracking-wider uppercase mb-3">
                  {activeTab === "Active Events" ? "Quizzes to Attempt" : "Attempted Quizzes"}
                </h4>
                
                {loadingQuizzes ? (
                  <div className="text-xs text-gray-500 italic py-2">Loading quizzes...</div>
                ) : eventQuizzes && eventQuizzes.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {eventQuizzes.map((quiz) => {
                      const isSubmitted = quiz.status === "submitted";
                      return (
                        <div 
                          key={quiz.quiz_template_id}
                          className="bg-white border border-[#C5E1D4] rounded-lg p-3 flex items-center justify-between hover:border-[#73D38F] transition-colors group cursor-pointer"
                          onClick={() => {
                            setSelectedEvent(null);
                            if (isSubmitted) {
                              navigate(`/student/quizzes/${quiz.attempt_id}/results`);
                            } else {
                              navigate(`/student/quizzes/${selectedEvent.id}/${quiz.quiz_type}/attempt`);
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#E8F3EB] flex items-center justify-center text-[#2A523D]">
                              {isSubmitted ? <CheckCircle2 className="w-4 h-4 text-[#3A7654]" /> : <FileText className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-[#3E4F45]">{quiz.quiz_type} - {quiz.title}</div>
                              <div className="text-xs text-gray-500 font-medium">
                                {isSubmitted ? (quiz.score_display || "Submitted") : "Available to attempt"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              isSubmitted ? "bg-[#E8F3EB] text-[#386641]" : "bg-[#FFF5E5] text-[#8A7B52]"
                            }`}>
                              {isSubmitted ? "View Results" : "Attempt"}
                            </span>
                            <div className="text-[#3A7654] opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : rsvpedEventIds.has(String(selectedEvent.id)) ? (
                  <p className="text-sm text-gray-500 italic">No quizzes linked to this event.</p>
                ) : (
                  <p className="text-sm text-gray-500 italic">RSVP to access the quizzes for this event.</p>
                )}
              </div>

              {/* Notes Section */}
              <div>
                <h4 className="text-xs font-semibold text-[#9DB1A3] tracking-wider uppercase mb-2">
                  {activeTab === "Active Events" ? "Personal Notes" : "Your Saved Note"}
                </h4>
                
                {activeTab === "Active Events" ? (
                  <div className="relative">
                    <textarea 
                      className="w-full bg-white border border-[#C5E1D4] rounded-xl p-3 pb-12 text-sm text-[#3E4F45] font-medium resize-none focus:outline-none focus:ring-1 focus:ring-[#73D38F]" 
                      rows="4" 
                      placeholder="Add your personal notes for this event here..."
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                    ></textarea>
                    <button 
                      className="absolute bottom-3 right-3 bg-[#E8F3EB] text-[#3A7654] hover:bg-[#3A7654] hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-sm border border-[#C5E1D4]"
                      onClick={() => alert("Notes saved successfully!")}
                    >
                      <Save className="w-3.5 h-3.5" /> Save Note
                    </button>
                  </div>
                ) : (
                  <div className="w-full bg-white border border-[#C5E1D4] rounded-xl p-4 text-sm text-[#3E4F45] font-medium leading-relaxed min-h-[100px]">
                    {selectedEvent.saved_notes || <span className="text-gray-400 italic">No notes saved for this event.</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 shrink-0 flex justify-end border-t border-black/10 pt-4">
              <button
                onClick={() => setSelectedEvent(null)}
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

export default StudentEvents;

