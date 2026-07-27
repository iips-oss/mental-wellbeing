import React, { useState } from "react";
import { MapPin, X, Save, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MobileStudentEvents = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Active Events");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notesInput, setNotesInput] = useState("");
  
  const tabs = ["Active Events", "Past Events"];

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(h, 10));
    date.setMinutes(parseInt(m, 10));
    return date.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const mockActiveEvents = [
    {
      id: 1,
      title: "Stress Management Workshop",
      venue: "Seminar Hall A, Block 3",
      event_date: "2026-07-20",
      event_time: "14:00",
      quizzes_count: "4",
      status: "scheduled",
      quizzes: [
        { id: 101, type: "SCQ", name: "Self Concept Questionnaire" },
        { id: 102, type: "GWBS", name: "General Well-Being Schedule" },
        { id: 103, type: "TABBPS", name: "Type A/B Behaviour Pattern" },
        { id: 104, type: "EI", name: "Emotional Intelligence" }
      ],
      saved_notes: ""
    }
  ];

  const mockPastEvents = [
    {
      id: 2,
      title: "Exam Anxiety Seminar",
      venue: "Main Auditorium",
      event_date: "2026-06-15",
      event_time: "10:00",
      quizzes_count: "2",
      status: "completed",
      quizzes: [
        { id: 1, type: "SCQ", name: "Self Concept Questionnaire" },
        { id: 4, type: "EI", name: "Emotional Intelligence" }
      ],
      saved_notes: "This was a really helpful seminar. I learned some great breathing techniques."
    },
    {
      id: 3,
      title: "Mindfulness Retreat",
      venue: "Open Grounds",
      event_date: "2026-05-10",
      event_time: "08:00",
      quizzes_count: "1",
      status: "completed",
      quizzes: [
        { id: 2, type: "GWBS", name: "General Well-Being Schedule" }
      ],
      saved_notes: "Felt very relaxed after the morning meditation."
    }
  ];

  const currentEvents = activeTab === "Active Events" ? mockActiveEvents : mockPastEvents;

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setNotesInput(event.saved_notes || "");
  };

  return (
    <div className="w-full h-full flex flex-col font-sans relative">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[#386641] font-serif leading-none mb-2">
          Events
        </h1>
        <p className="text-sm text-[#9DB1A3] font-medium">
          Register for wellbeing activities
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
          {/* Removed table header for mobile card layout */}

          <div className="flex flex-col gap-4 mt-6 overflow-y-auto pr-2 pb-10">
            {currentEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-3 bg-[#E5E5E5] border border-[#2F3C36] rounded-xl px-5 py-4"
              >
                <div className="text-[#3A8458] font-sans font-bold text-lg leading-tight">
                  {event.title}
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#3E4F45]">
                  <span className="bg-[#2F3C36]/10 px-2 py-1 rounded">
                    {new Date(event.event_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })} • {formatTime(event.event_time)}
                  </span>
                  <span className="bg-[#2F3C36]/10 px-2 py-1 rounded">
                    Quizzes: {event.quizzes_count}
                  </span>
                </div>

                <div className="flex justify-end mt-1 border-t border-[#2F3C36]/20 pt-3">
                  <button 
                    onClick={() => handleOpenModal(event)}
                    className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-medium px-4 py-2 rounded-lg w-full text-center transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
            {currentEvents.length === 0 && (
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

              {/* Quizzes Section */}
              <div>
                <h4 className="text-xs font-semibold text-[#9DB1A3] tracking-wider uppercase mb-3">
                  {activeTab === "Active Events" ? "Quizzes to Attempt" : "Attempted Quizzes"}
                </h4>
                
                {selectedEvent.quizzes && selectedEvent.quizzes.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {selectedEvent.quizzes.map((quiz) => (
                      <div 
                        key={quiz.id}
                        className="bg-white border border-[#C5E1D4] rounded-lg p-3 flex items-center justify-between hover:border-[#73D38F] transition-colors group cursor-pointer"
                        onClick={() => {
                          if (activeTab === "Active Events") {
                            navigate(`/student/quizzes/${quiz.id}/attempt`);
                          } else {
                            navigate(`/student/quizzes/${quiz.id}/results`);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#E8F3EB] flex items-center justify-center text-[#2A523D]">
                            {activeTab === "Active Events" ? <FileText className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-[#3A7654]" />}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#3E4F45]">{quiz.type}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{quiz.name}</div>
                          </div>
                        </div>
                        <div className="text-[#3A7654] opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No quizzes linked to this event.</p>
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

export default MobileStudentEvents;
