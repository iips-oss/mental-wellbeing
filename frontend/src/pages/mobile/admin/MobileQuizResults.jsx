import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import AuthService from "../../../services/auth";

const QUIZ_NAME_MAP = {
  SCQ: "Self Concept",
  GWBS: "General Well-Being",
  TABBPS: "Type A/B Personality",
  EI: "Emotional Intelligence"
};

const EI_COMPETENCIES = [
  { key: "Self_Awareness", label: "Self Awareness" },
  { key: "Managing_Emotions", label: "Managing Emotions" },
  { key: "Motivating_Oneself", label: "Motivating Oneself" },
  { key: "Empathy", label: "Empathy" },
  { key: "Social_Skill", label: "Social Skill" }
];

const MobileQuizResults = () => {
  const navigate = useNavigate();
  const { id: quizTemplateId } = useParams();

  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const quizType = searchParams.get("quizType") || "SCQ";

  const quizName = QUIZ_NAME_MAP[quizType] || quizType;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCompetency, setSelectedCompetency] = useState("Self_Awareness");
  const [showCompetencyDropdown, setShowCompetencyDropdown] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    const fetchResults = async () => {
      if (!eventId) {
        setError(
          "Missing event reference — please open this page from an event's details."
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        if (quizType === "EI") {
          const data = await AuthService.getEIResults(eventId);
          setResults(data.results || []);
        } else {
          const allResults = await AuthService.getEventResults(eventId);
          const filtered = (allResults || []).filter(
            (r) => r.quiz_type === quizType
          );
          setResults(filtered);
        }
      } catch (err) {
        console.error("Failed to load quiz results:", err);
        setError("Failed to load results for this quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [eventId, quizType]);

  const getInterpretation = (r) => {
    if (quizType === "TABBPS") {
      return (
        r?.result_json?.final_classification ??
        r?.final_classification ??
        "Unclassified"
      );
    }
    return (
      r?.result_json?.interpretation ??
      r?.interpretation ??
      "Completed"
    );
  };

  const getScoreA = (r) =>
    r?.result_json?.form_a_score ??
    r?.form_a_score ??
    0;

  const getScoreB = (r) =>
    r?.result_json?.form_b_score ??
    r?.form_b_score ??
    0;

  const getScore = (r) =>
    r?.total_score ??
    r?.result_json?.total_score ??
    0;

  const getInterpretationBadge = (level) => {
    switch (level) {
      case "Development Priority":
      case "Low":
        return "bg-[#F87171] text-black border-[#F87171]"; // Red
      case "Needs Attention":
      case "Average":
        return "bg-[#FDE047] text-black border-[#FDE047]"; // Yellow
      case "Strength":
      case "Above Average":
      case "Balanced":
        return "bg-[#86E8A8] text-black border-[#86E8A8]"; // Light Green
      case "High":
        return "bg-[#3A8458] text-black border-[#3A8458]"; // Dark Green
      case "Type A":
        return "bg-[#F9A8D4] text-black border-[#F9A8D4]"; // Pink
      case "Type B":
        return "bg-[#93C5FD] text-black border-[#93C5FD]"; // Light Blue
      case "No strong pattern":
        return "bg-[#D6C1B9] text-black border-[#D6C1B9]"; // Brown/Grey
      case "Below Average":
        return "bg-[#F3D8C7] text-black border-[#F3D8C7]"; // Peach/Tan
      default:
        return "bg-gray-200 text-black border-gray-200";
    }
  };

  const courses = useMemo(() => {
    const set = new Set(results.map((r) => r.course).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [results]);

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      if (selectedCourse !== "All" && r.course !== selectedCourse) return false;
      if (selectedYear !== "All") {
        const studentYear = r.semester ? `${Math.ceil(r.semester / 2)}` : null;
        if (studentYear && !selectedYear.startsWith(studentYear)) return false;
      }
      return true;
    });
  }, [results, selectedCourse, selectedYear]);

  const years = ["All", "1st Year", "2nd Year", "3rd Year", "4th Year"];

  return (
    <div className="w-full h-full flex flex-col font-sans relative">
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/events")}
          className="flex items-center text-[#5B5B5B] font-semibold text-sm hover:text-black mb-4 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Manage Events
        </button>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#386641] font-serif leading-none mb-2">
              Quiz Results
            </h1>
            <p className="text-sm text-[#9DB1A3] font-semibold">
              {quizName} Assessment Results ({filteredResults.length} Submissions)
            </p>
          </div>

          <div className="flex flex-col w-full gap-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <select 
                value={selectedCourse} 
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full sm:w-auto bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#386641]/50 text-gray-700 cursor-pointer"
              >
                {courses.map(c => <option key={c} value={c}>{c === "All" ? "All Courses" : c}</option>)}
              </select>
              
              <select 
                value={selectedYear} 
                onChange={e => setSelectedYear(e.target.value)}
                className="w-full sm:w-auto bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#386641]/50 text-gray-700 cursor-pointer"
              >
                {years.map(y => <option key={y} value={y}>{y === "All" ? "All Years" : y}</option>)}
              </select>
            </div>

            {quizType === "EI" && (
              <div className="relative w-full sm:w-auto">
                <button 
                  onClick={() => setShowCompetencyDropdown(!showCompetencyDropdown)}
                  className="w-full flex items-center justify-between gap-2 bg-[#2E7D4F] hover:bg-[#256641] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  {EI_COMPETENCIES.find((c) => c.key === selectedCompetency)?.label || "Select Competency"}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showCompetencyDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-xl z-20 overflow-hidden py-1">
                    {EI_COMPETENCIES.map(comp => (
                      <button
                        key={comp.key}
                        onClick={() => {
                          setSelectedCompetency(comp.key);
                          setShowCompetencyDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${selectedCompetency === comp.key ? 'bg-[#386641]/10 text-[#386641] font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        {comp.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#F3F2F2] rounded-3xl p-8 flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#386641]"></div>
            <p className="text-gray-500 font-medium">Loading quiz results...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100 font-semibold">
            {error}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-medium">
            No quiz submissions found matching the selected criteria.
          </div>
        ) : quizType === "EI" ? (
          <div className="flex flex-col mt-4 overflow-y-auto pb-10 flex-1">
            {filteredResults.map((r, idx) => {
              const compScore = r.result_json?.competency_scores?.[selectedCompetency] ?? 0;
              const compInterp = r.result_json?.competency_interpretations?.[selectedCompetency] ?? "Completed";
              return (
                <div
                  key={idx}
                  className="flex flex-col border-b border-[#2F3C36]/10 py-4 last:border-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-black font-serif text-base leading-tight font-bold">
                        {r.student_name}
                      </div>
                      <div className="text-xs text-[#3E4F45] font-semibold mt-1">
                        {r.enrollment_no} • {r.course} • Sem {r.semester}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-sm text-[#386641]">
                        Score: {compScore}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border uppercase tracking-wider mt-1 ${getInterpretationBadge(
                          compInterp
                        )}`}
                      >
                        {compInterp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : quizType === "TABBPS" ? (
          <div className="flex flex-col mt-4 overflow-y-auto pb-10 flex-1">
            {filteredResults.map((r, idx) => (
              <div
                key={idx}
                className="flex flex-col border-b border-[#2F3C36]/10 py-4 last:border-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-black font-serif text-base leading-tight font-bold">
                      {r.student_name}
                    </div>
                    <div className="text-xs text-[#3E4F45] font-semibold mt-1">
                      {r.enrollment_no} • {r.course} • Sem {r.semester}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-sm text-[#386641]">
                      A: {getScoreA(r)} | B: {getScoreB(r)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border uppercase tracking-wider mt-1 ${getInterpretationBadge(
                        getInterpretation(r)
                      )}`}
                    >
                      {getInterpretation(r)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col mt-4 overflow-y-auto pb-10 flex-1">
            {filteredResults.map((r, idx) => (
              <div
                key={idx}
                className="flex flex-col border-b border-[#2F3C36]/10 py-4 last:border-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-black font-serif text-base leading-tight font-bold">
                      {r.student_name}
                    </div>
                    <div className="text-xs text-[#3E4F45] font-semibold mt-1">
                      {r.enrollment_no} • {r.course} • Sem {r.semester}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-sm text-[#386641]">
                      Score: {getScore(r)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border uppercase tracking-wider mt-1 ${getInterpretationBadge(
                        getInterpretation(r)
                      )}`}
                    >
                      {getInterpretation(r)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileQuizResults;
