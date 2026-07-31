import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import AuthService from "../../services/auth";

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

const QuizResults = () => {
  const navigate = useNavigate();
  const { id: quizTemplateId } = useParams();

  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const quizType = searchParams.get("quizType") || "SCQ";

  const quizName = QUIZ_NAME_MAP[quizType] || quizType;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCompetency, setSelectedCompetency] =
    useState("Self_Awareness");

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

          const filtered = allResults.filter(
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
        null
      );
    }

    return (
      r?.result_json?.interpretation ??
      r?.interpretation ??
      null
    );
  };

  const getScoreA = (r) =>
    r?.result_json?.form_a_score ??
    r?.form_a_score ??
    null;

  const getScoreB = (r) =>
    r?.result_json?.form_b_score ??
    r?.form_b_score ??
    null;

  const isTabbps = quizType === "TABBPS";

  const hasScoreABColumns =
    isTabbps &&
    results.some((r) => getScoreA(r) !== null);

  const getInterpretationInfo = (level) => {
    if (!level) {
      return {
        label: null,
        badgeClass: "bg-gray-200 text-black border-gray-200"
      };
    }

    const text = level.toLowerCase();

    // TABBPS
    if (text.includes("type a")) {
      return {
        label: "Type A",
        badgeClass:
          "bg-[#E8D6E1] text-[#5B4A55] border-[#D8C3D0]"
      };
    }

    if (text.includes("type b")) {
      return {
        label: "Type B",
        badgeClass:
          "bg-[#D8E5EA] text-[#46575E] border-[#C5D6DC]"
      };
    }

    if (text.includes("mixed") || text.includes("balanced")) {
      return {
        label: "Balanced",
        badgeClass:
          "bg-[#DDE8DD] text-[#4E5E4E] border-[#CADACA]"
      };
    }

    if (text.includes("no strong")) {
      return {
        label: "No Strong Pattern",
        badgeClass:
          "bg-[#DDD4D2] text-[#5E5551] border-[#CEC3C0]"
      };
    }

    if (text.includes("inconclusive")) {
      return {
        label: "Inconclusive",
        badgeClass:
          "bg-[#E4E2DD] text-[#595750] border-[#D5D2CB]"
      };
    }

    // EI
    if (text.includes("development priority")) {
      return {
        label: "Low",
        badgeClass:
          "bg-[#F87171] text-black border-[#F87171]"
      };
    }

    if (text.includes("needs attention")) {
      return {
        label: "Average",
        badgeClass:
          "bg-[#FDE047] text-black border-[#FDE047]"
      };
    }

    if (text.includes("strength")) {
      return {
        label: "Strength",
        badgeClass:
          "bg-[#86E8A8] text-black border-[#86E8A8]"
      };
    }

    // SCQ / GWBS
    if (text.includes("above average")) {
      return {
        label: "Above Average",
        badgeClass:
          "bg-[#86E8A8] text-black border-[#86E8A8]"
      };
    }

    if (text.includes("below average")) {
      return {
        label: "Below Average",
        badgeClass:
          "bg-[#F3D8C7] text-black border-[#F3D8C7]"
      };
    }

    if (text.includes("high")) {
      return {
        label: "High",
        badgeClass:
          "bg-[#3A8458] text-black border-[#3A8458]"
      };
    }

    if (text.includes("average")) {
      return {
        label: "Average",
        badgeClass:
          "bg-[#FDE047] text-black border-[#FDE047]"
      };
    }

    if (text.includes("low")) {
      return {
        label: "Low",
        badgeClass:
          "bg-[#F87171] text-black border-[#F87171]"
      };
    }

    return {
      label: level,
      badgeClass:
        "bg-gray-200 text-black border-gray-200"
    };
  };

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

  const columnCount = hasScoreABColumns ? 7 : 6;

  return (
    <div className="w-full h-full flex flex-col font-sans relative">

      {/* HEADER */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/quizzes")}
          className="flex items-center text-[#5B5B5B] font-semibold text-sm hover:text-black mb-4 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Manage Quizzes
        </button>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#386641] font-serif leading-none mb-2">
              Quiz Results
            </h1>

            <p className="text-sm text-[#9DB1A3] font-semibold">
              {quizName} ({quizType})
            </p>
          </div>

          {/* EI COMPETENCY SELECTOR */}
          {quizType === "EI" && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#5B5B5B]">
                Competency
              </span>

              <select
                value={selectedCompetency}
                onChange={(e) =>
                  setSelectedCompetency(e.target.value)
                }
                className="bg-[#386641] text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer outline-none shadow-sm"
              >
                {EI_COMPETENCIES.map((competency) => (
                  <option
                    key={competency.key}
                    value={competency.key}
                  >
                    {competency.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* RESULTS CARD */}
      <div className="bg-[#F3F2F2] rounded-3xl p-8 flex-1 overflow-hidden flex flex-col">

        {loading ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#386641]"></div>

            <p className="text-gray-500 font-medium">
              Loading results...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 font-semibold">
            {error}
          </div>
        ) : (
          <>
            {/* TABLE HEADER */}
            <div
              className="grid gap-4 px-6 pb-4 border-b border-black/10 font-serif font-semibold text-black shrink-0"
              style={{
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`
              }}
            >
              <div className="col-span-2">
                Student Name
              </div>

              <div className="text-center">
                Roll No.
              </div>

              {hasScoreABColumns ? (
                <>
                  <div className="text-center">
                    Score A
                  </div>

                  <div className="text-center">
                    Score B
                  </div>
                </>
              ) : (
                <div className="text-center">
                  Score
                </div>
              )}

              <div className="text-center">
                Attempted
              </div>

              <div className="text-center">
                Interpretation
              </div>
            </div>

            {/* TABLE BODY */}
            <div className="flex flex-col gap-4 mt-6 overflow-y-auto pr-2 pb-10 flex-1">

              {results.length === 0 ? (
                <div className="text-center py-10 text-gray-500 font-medium">
                  No submitted attempts yet for this quiz.
                </div>
              ) : (
                results.map((r, idx) => {

                  let interpretation = null;
                  let score = null;

                  if (quizType === "EI") {
                    interpretation =
                      r?.[selectedCompetency]?.interpretation ??
                      null;

                    score =
                      r?.[selectedCompetency]?.score ??
                      null;
                  } else {
                    interpretation = getInterpretation(r);
                    score = r?.total_score ?? null;
                  }

                  const {
                    label: interpretationLabel,
                    badgeClass
                  } = getInterpretationInfo(interpretation);

                  return (
                    <div
                      key={idx}
                      className="grid gap-4 items-center bg-[#E5E5E5] border border-transparent rounded-xl px-6 py-3 transition-colors"
                      style={{
                        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`
                      }}
                    >
                      {/* STUDENT */}
                      <div className="col-span-2 text-black font-serif text-lg">
                        {r.student_name}
                      </div>

                      {/* ROLL / ENROLLMENT NUMBER */}
                      <div className="text-center font-sans text-base">
                        {r.is_provisional_id ? (
                          <span
                            className="text-gray-500 italic"
                            title="Roll number not assigned yet — showing enrollment number"
                          >
                            {r.enrollment_no}
                          </span>
                        ) : (
                          <span className="text-black">{r.enrollment_no}</span>
                        )}
                      </div>

                      {/* SCORES */}
                      {hasScoreABColumns ? (
                        <>
                          <div className="text-center text-black font-sans text-base">
                            {getScoreA(r) ?? "—"}
                          </div>

                          <div className="text-center text-black font-sans text-base">
                            {getScoreB(r) ?? "—"}
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-black font-sans text-base">
                          {score ?? "—"}
                        </div>
                      )}

                      {/* ATTEMPT DATE */}
                      <div className="text-center text-black font-sans text-sm">
                        {formatDate(r.attempted_at)}
                      </div>

                      {/* INTERPRETATION */}
                      <div className="flex justify-center">
                        {interpretation ? (
                          <span
                            className={`px-6 py-1.5 rounded-full text-sm font-semibold min-w-[160px] text-center shadow-sm border ${badgeClass}`}
                          >
                            {interpretationLabel}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">
                            —
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizResults;