import React, { useEffect, useState } from "react";
import { Plus, X, Calendar, MapPin, Check, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth";

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Active Events"); // "Past Events" or "Active Events"
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedPastEvent, setSelectedPastEvent] = useState(null);
  const [pastEventQuizzes, setPastEventQuizzes] = useState([]);
  const [loadingPastEventQuizzes, setLoadingPastEventQuizzes] = useState(false);
  const [pastEventQuizzesError, setPastEventQuizzesError] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [selectedQuizzes, setSelectedQuizzes] = useState({
    SCQ: true,
    GWBS: true,
    TABBPS: false,
    EI: false
  });
  const [otp, setOtp] = useState("4821");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const tabs = ["Past Events", "Active Events"];

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await AuthService.getAdminEvents();
      setEvents(data);
    } catch (err) {
      console.error("Failed to load events:", err);
      setError("Failed to load events. Please try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCheckboxChange = (quiz) => {
    setSelectedQuizzes((prev) => ({
      ...prev,
      [quiz]: !prev[quiz]
    }));
  };

  const resetForm = () => {
    setTitle("");
    setVenue("");
    setEventDate("");
    setEventTime("");
    setEndTime("");
    setDescription("");
    setSelectedQuizzes({ SCQ: true, GWBS: true, TABBPS: false, EI: false });
    setOtp("4821");
    setFormError("");
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openManageModal = (event) => {
    setSelectedEventId(event.id);
    setTitle(event.title);
    setVenue(event.venue || "");
    setEventDate(event.event_date);
    setEventTime(event.event_time);
    setEndTime(event.end_time || "");
    setDescription(event.description || "");
    setSelectedQuizzes(event.quizzes || { SCQ: false, GWBS: false, TABBPS: false, EI: false });
    setOtp("4821"); // Mock OTP
    setFormError("");
    setShowManageModal(true);
  };

  const openPastEventDetails = async (event) => {
    setSelectedPastEvent(event);
    setPastEventQuizzes([]);
    setPastEventQuizzesError("");
    setLoadingPastEventQuizzes(true);
    try {
      const quizzes = await AuthService.getEventQuizzes(event.id);
      setPastEventQuizzes(quizzes);
    } catch (err) {
      console.error("Failed to load quizzes for event:", err);
      setPastEventQuizzesError("Failed to load quizzes for this event.");
    } finally {
      setLoadingPastEventQuizzes(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    // Parse time like "14:00" to "2:00 PM"
    const [h, m] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(h, 10));
    date.setMinutes(parseInt(m, 10));
    return date.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Converts a "HH:MM" input value into the "HH:MM:00" format the backend expects.
  // Leaves already-complete "HH:MM:SS" strings untouched.
  const toBackendTime = (timeStr) => {
    if (!timeStr) return timeStr;
    return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    // quiz_types in a fixed, predictable order; sequences generated to match [1, 2, ...]
    const quizOrder = ["SCQ", "GWBS", "TABBPS", "EI"];
    const quizTypes = quizOrder.filter((k) => selectedQuizzes[k]);
    if (quizTypes.length === 0) {
      setFormError("Please select at least one quiz type to assign to this event.");
      setSubmitting(false);
      return;
    }
    const sequences = quizTypes.map((_, idx) => idx + 1);

    const payload = {
      title,
      venue,
      event_date: eventDate,
      event_time: toBackendTime(eventTime),
      description,
      quiz_types: quizTypes,
      sequences
    };

    try {
      await AuthService.createEvent(payload);
      setShowAddModal(false);
      resetForm();
      await fetchEvents();
    } catch (err) {
      console.error("Failed to create event:", err);
      setFormError(
        err?.response?.data?.detail || "Failed to create event. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    const quizTypes = Object.keys(selectedQuizzes).filter((k) => selectedQuizzes[k]);
    if (quizTypes.length === 0) {
      setFormError("Please select at least one quiz type to assign to this event.");
      setSubmitting(false);
      return;
    }

    try {
      setTimeout(() => {
        setEvents(prev => prev.map(ev => {
          if (ev.id === selectedEventId) {
            return {
              ...ev,
              title,
              venue,
              event_date: eventDate,
              event_time: eventTime,
              end_time: endTime,
              description,
              quizzes_count: `${quizTypes.length}/4`,
              quizzes: selectedQuizzes
            };
          }
          return ev;
        }));
        setShowManageModal(false);
        resetForm();
        setSubmitting(false);
      }, 500);
    } catch (err) {
      setFormError("Failed to update event.");
      setSubmitting(false);
    }
  };

  const generateNewOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(newOtp);
  };

  const handleMarkCompleted = async () => {
    if (!selectedEventId) return;
    try {
      setSubmitting(true);
      await AuthService.markEventCompleted(selectedEventId);
      setEvents(prev => prev.map(ev => {
        if (ev.id === selectedEventId) {
          return {
            ...ev,
            status: "completed"
          };
        }
        return ev;
      }));
      setShowManageModal(false);
      resetForm();
    } catch (err) {
      console.error("Failed to mark event as completed:", err);
      setFormError("Failed to mark event as completed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col justify-center items-center h-full gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#386641]"></div>
        <p className="text-gray-500 font-medium">Loading events list...</p>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];
  
  const pastEvents = events.filter((e) => {
    return e.status === "completed" || e.status === "closed" || e.status === "cancelled" || e.event_date < todayStr;
  });

  const activeEvents = events.filter((e) => {
    return (e.status === "scheduled" || e.status === "ongoing") && e.event_date >= todayStr;
  });

  const displayedEvents = activeTab === "Past Events" ? pastEvents : activeEvents;

  return (
    <div className="w-full h-full flex flex-col font-sans relative">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#386641] font-serif leading-none mb-2">
            Manage Events
          </h1>
          <p className="text-sm text-[#9DB1A3] font-medium">
            Track and manage quizzes
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 border border-red-100 font-semibold font-sans">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === tab
                ? "bg-[#F3F2F2] border border-[#73D38F] text-[#386641]"
                : "text-[#9DB1A3] hover:text-[#386641]"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#F3F2F2] rounded-3xl p-8 flex-1 overflow-auto">
        {displayedEvents.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-sans font-semibold">
            No {activeTab.toLowerCase()} found.
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-12 gap-4 px-6 pb-4 border-b border-black/10 font-serif font-semibold text-black">
              <div className="col-span-4">Event</div>
              <div className="col-span-2 text-center">Quizzes</div>
              <div className="col-span-2 text-center">Date</div>
              <div className="col-span-2 text-center">
                {activeTab === "Past Events" ? "Attendees" : "Registrations"}
              </div>
              <div className="col-span-2 text-right pr-6">
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-6 overflow-y-auto pr-2 pb-10">
              {displayedEvents.map((event) => (
                <div
                  key={event.id}
                  className="grid grid-cols-12 gap-4 items-center bg-[#E5E5E5] border border-[#2F3C36] rounded-xl px-6 py-4"
                >
                  <div className="col-span-4">
                    <div className="text-[#3A8458] font-sans font-medium text-lg truncate pr-2">
                      {event.title}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-[#3E4F45] truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {event.venue}
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-center text-[#3E4F45] text-sm">
                    {event.quizzes_count}
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="text-[#3E4F45] text-sm mb-0.5">
                      {new Date(event.event_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </div>
                    <div className="text-xs text-[#9DB1A3] font-medium">
                      {formatTime(event.event_time)}
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="text-[#3A8458] text-sm font-medium">
                      {event.attendees_count} {activeTab === "Past Events" ? "Attendees" : "Registered"}
                    </span>
                  </div>

                  <div className="col-span-2 flex justify-end">
                    {activeTab === "Past Events" ? (
                      <button 
                        onClick={() => openPastEventDetails(event)}
                        className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    ) : (
                      <button 
                        onClick={() => openManageModal(event)}
                        className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        Manage
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Shared Modal Form Components */}
      {(showAddModal || showManageModal) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-[#F3F2F2] rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative border border-[#2F3C36] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setShowAddModal(false); setShowManageModal(false); }}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-[#386641] font-serif leading-none mb-2">
                {showManageModal ? "Manage event" : "Create New Event"}
              </h3>
              <p className="text-sm text-[#9DB1A3] font-medium">
                {showManageModal ? "Edit details for this event — changes apply immediately on save" : "Fill the details to schedule a new event"}
                {showManageModal && <span className="ml-4 text-[#3A8458] font-bold bg-[#E5E5E5] px-2 py-1 rounded-md text-xs border border-[#2F3C36]">• Scheduled</span>}
              </p>
            </div>

            {formError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 border border-red-100 font-semibold font-sans">
                {formError}
              </div>
            )}

            <form onSubmit={showManageModal ? handleUpdateEvent : handleAddEvent} className="space-y-6">
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase">Basic Information</h4>
                
                <div>
                  <label className="block text-sm font-semibold text-black mb-1.5 font-sans">Event title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Stress Management Workshop"
                    className="w-full border border-[#2F3C36]/20 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#386641]/50 text-[#3E4F45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-1.5 font-sans">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    placeholder="A hands-on session exploring stress management techniques..."
                    className="w-full border border-[#2F3C36]/20 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#386641]/50 text-[#3E4F45] resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-1.5 font-sans">Venue <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    required
                    placeholder="e.g. Seminar Hall A, Block 3"
                    className="w-full border border-[#2F3C36]/20 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#386641]/50 text-[#3E4F45]"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-black/10">
                <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase">Date and Time</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-1.5 font-sans">Event date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="w-full border border-[#2F3C36]/20 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#386641]/50 text-[#3E4F45]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-1.5 font-sans">Start time <span className="text-red-500">*</span></label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      required
                      className="w-full border border-[#2F3C36]/20 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#386641]/50 text-[#3E4F45]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-1.5 font-sans">End time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full border border-[#2F3C36]/20 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#386641]/50 text-[#3E4F45]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-black/10">
                <div>
                  <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Assigned Quizzes</h4>
                  <p className="text-xs text-[#3E4F45] mb-3">Add or remove quizzes for this event. Removing a quiz will not delete existing student submissions.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* SCQ */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border border-[#2F3C36]/20 cursor-pointer select-none transition-colors ${
                      selectedQuizzes["SCQ"]
                        ? "bg-[#E5E5E5] border-[#2F3C36]"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuizzes["SCQ"]}
                      onChange={() => handleCheckboxChange("SCQ")}
                      className="hidden"
                    />
                    <div className={`mt-0.5 w-4 h-4 shrink-0 rounded-sm flex items-center justify-center border transition-all ${
                      selectedQuizzes["SCQ"]
                        ? "bg-[#2E7D4F] border-[#2E7D4F] text-white"
                        : "border-gray-300 bg-white"
                    }`}>
                      {selectedQuizzes["SCQ"] && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className={`text-sm font-bold font-sans ${selectedQuizzes["SCQ"] ? "text-[#386641]" : "text-gray-700"}`}>SCQ-S</div>
                      <div className="text-xs text-[#9DB1A3] mt-0.5 font-medium">Self Concept Questionnaire — 48 questions, 6 dimensions</div>
                    </div>
                  </label>
                  
                  {/* GWBS */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border border-[#2F3C36]/20 cursor-pointer select-none transition-colors ${
                      selectedQuizzes["GWBS"]
                        ? "bg-[#E5E5E5] border-[#2F3C36]"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuizzes["GWBS"]}
                      onChange={() => handleCheckboxChange("GWBS")}
                      className="hidden"
                    />
                    <div className={`mt-0.5 w-4 h-4 shrink-0 rounded-sm flex items-center justify-center border transition-all ${
                      selectedQuizzes["GWBS"]
                        ? "bg-[#2E7D4F] border-[#2E7D4F] text-white"
                        : "border-gray-300 bg-white"
                    }`}>
                      {selectedQuizzes["GWBS"] && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className={`text-sm font-bold font-sans ${selectedQuizzes["GWBS"] ? "text-[#386641]" : "text-gray-700"}`}>GWBS-KADA</div>
                      <div className="text-xs text-[#9DB1A3] mt-0.5 font-medium">General Well-Being Scale — 55 questions, gender-adjusted</div>
                    </div>
                  </label>

                  {/* TABBPS */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border border-[#2F3C36]/20 cursor-pointer select-none transition-colors ${
                      selectedQuizzes["TABBPS"]
                        ? "bg-[#E5E5E5] border-[#2F3C36]"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuizzes["TABBPS"]}
                      onChange={() => handleCheckboxChange("TABBPS")}
                      className="hidden"
                    />
                    <div className={`mt-0.5 w-4 h-4 shrink-0 rounded-sm flex items-center justify-center border transition-all ${
                      selectedQuizzes["TABBPS"]
                        ? "bg-[#2E7D4F] border-[#2E7D4F] text-white"
                        : "border-gray-300 bg-white"
                    }`}>
                      {selectedQuizzes["TABBPS"] && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className={`text-sm font-bold font-sans ${selectedQuizzes["TABBPS"] ? "text-[#386641]" : "text-gray-700"}`}>TABBPS-DJ</div>
                      <div className="text-xs text-[#9DB1A3] mt-0.5 font-medium">Type A/B Behaviour Pattern — 33 questions, dual form</div>
                    </div>
                  </label>

                  {/* EI */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border border-[#2F3C36]/20 cursor-pointer select-none transition-colors ${
                      selectedQuizzes["EI"]
                        ? "bg-[#E5E5E5] border-[#2F3C36]"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuizzes["EI"]}
                      onChange={() => handleCheckboxChange("EI")}
                      className="hidden"
                    />
                    <div className={`mt-0.5 w-4 h-4 shrink-0 rounded-sm flex items-center justify-center border transition-all ${
                      selectedQuizzes["EI"]
                        ? "bg-[#2E7D4F] border-[#2E7D4F] text-white"
                        : "border-gray-300 bg-white"
                    }`}>
                      {selectedQuizzes["EI"] && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className={`text-sm font-bold font-sans ${selectedQuizzes["EI"] ? "text-[#386641]" : "text-gray-700"}`}>EI-LAL</div>
                      <div className="text-xs text-[#9DB1A3] mt-0.5 font-medium">Emotional Intelligence — 50 questions, 5 competencies</div>
                    </div>
                  </label>
                </div>
              </div>

              {showManageModal && (
                <div className="space-y-4 pt-4 border-t border-black/10">
                  <div>
                    <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Attendance OTP</h4>
                    <p className="text-xs text-[#3E4F45] mb-3">Regenerating the OTP invalidates the old one. Only do this before the event starts.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-1.5 font-sans">OTP <span className="text-red-500">*</span></label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={otp}
                        readOnly
                        className="w-32 border border-[#2F3C36]/20 rounded-xl px-4 py-3 bg-white text-center font-bold tracking-[0.5em] text-lg text-black font-sans focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={generateNewOtp}
                        className="border border-[#2F3C36]/20 bg-white px-4 py-3 rounded-xl text-sm font-semibold text-black hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Regenerate
                      </button>
                    </div>
                    <p className="text-xs text-[#9DB1A3] mt-2 font-medium">4 digits only. Students get 3 attempts before being blocked.</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-6 border-t border-black/10">
                {showManageModal ? (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleMarkCompleted}
                      disabled={submitting}
                      className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Mark as Completed
                    </button>
                    <button
                      type="button"
                      className="text-red-500 font-semibold text-sm hover:bg-red-50 px-3 py-2.5 rounded-lg border border-transparent hover:border-red-100 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" /> Cancel event
                    </button>
                  </div>
                ) : (
                  <div></div>
                )}
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); setShowManageModal(false); }}
                    className="border border-[#2F3C36]/20 bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer text-sm"
                  >
                    Discard changes
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#2E7D4F] hover:bg-[#256641] text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                  >
                    {submitting ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Past Event Details Modal */}
      {selectedPastEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-[#F3F2F2] rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative border border-[#2F3C36] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPastEvent(null)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-[#386641] font-serif leading-none mb-2">
                Past Event Details
              </h3>
              <p className="text-sm text-[#9DB1A3] font-medium">
                Overview of the event and quizzes taken
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Event</h4>
                  <div className="text-[#3A8458] font-bold text-lg">{selectedPastEvent.title}</div>
                  <div className="text-[#3E4F45] text-sm mt-1 flex items-center gap-1">
                     <MapPin className="w-3.5 h-3.5 shrink-0" /> {selectedPastEvent.venue}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Date & Time</h4>
                  <div className="text-[#3E4F45] font-medium text-sm">
                    {new Date(selectedPastEvent.event_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    })} • {formatTime(selectedPastEvent.event_time)}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-1">Attendees</h4>
                  <div className="text-[#3E4F45] font-medium text-sm">{selectedPastEvent.attendees_count} Students</div>
                </div>
              </div>

              <div className="pt-4 border-t border-black/10">
                <h4 className="text-xs font-bold text-[#9DB1A3] tracking-wider uppercase mb-3">Quizzes Taken</h4>
                <div className="grid grid-cols-2 gap-4">
                  {loadingPastEventQuizzes ? (
                    <div className="col-span-2 text-sm text-[#9DB1A3] font-medium">
                      Loading quizzes...
                    </div>
                  ) : pastEventQuizzesError ? (
                    <div className="col-span-2 text-sm text-red-600 font-medium">
                      {pastEventQuizzesError}
                    </div>
                  ) : pastEventQuizzes.length === 0 ? (
                    <div className="col-span-2 text-sm text-[#9DB1A3] font-medium">
                      No quiz data available for this event.
                    </div>
                  ) : (
                    pastEventQuizzes.map((quiz) => {
                      const quizNameMap = {
                        SCQ: "Self Concept Questionnaire (SCQ)",
                        GWBS: "General Well-Being Scale (GWBS)",
                        TABBPS: "Type A/B Behaviour Pattern (TABBPS)",
                        EI: "Emotional Intelligence (EI)"
                      };
                      const fullName = quizNameMap[quiz.quiz_type] || quiz.title || quiz.quiz_type;

                      return (
                        <div
                          key={quiz.id}
                          onClick={() => {
                            setSelectedPastEvent(null);
                            navigate(
                              `/admin/quizzes/${quiz.id}/results?eventId=${selectedPastEvent.id}&quizType=${quiz.quiz_type}`
                            );
                          }}
                          className="bg-white border border-[#2F3C36]/20 rounded-xl p-4 cursor-pointer hover:border-[#386641] hover:shadow-md transition-all group"
                        >
                          <div className="text-[#3A8458] font-bold font-sans text-lg group-hover:text-[#2E7D4F] transition-colors">{quiz.quiz_type}</div>
                          <div className="text-xs text-[#9DB1A3] mt-1 font-medium">{fullName}</div>
                          <div className="mt-3 text-xs font-bold text-[#2E7D4F] uppercase tracking-wider flex items-center gap-1">
                            View Results &rarr;
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedPastEvent(null)}
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

export default ManageEvents;
