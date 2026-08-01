import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth";
import StudentService from "../../services/student";

const StudentQuizResults = () => {
  const { id, attemptId } = useParams();
  const targetId = attemptId || id;
  const navigate = useNavigate();

  const [studentInfo, setStudentInfo] = useState({ name: "Student", enrollment: "" });
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    AuthService.getMe()
      .then((data) => {
        setStudentInfo({
          name: data.name || "Student",
          enrollment: data.enrollment || ""
        });
      })
      .catch((err) => console.error(err));

    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await StudentService.getQuizAttemptResult(targetId);
        setResultData(res);
      } catch (err) {
        console.error("Failed to load quiz result:", err);
        setError(err.response?.data?.detail || "Failed to load quiz result.");
      } finally {
        setLoading(false);
      }
    };

    if (targetId) {
      fetchResult();
    }
  }, [targetId]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center font-sans text-[#386641] text-lg font-medium">
        Loading quiz results...
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center font-sans gap-4">
        <p className="text-red-500 font-medium">{error || "Quiz result not found."}</p>
        <button
          onClick={() => navigate("/student/quizzes")}
          className="bg-[#2E7D4F] hover:bg-[#256641] text-white px-5 py-2 rounded-lg font-medium transition-colors cursor-pointer text-sm"
        >
          Back to My Quizzes
        </button>
      </div>
    );
  }

  const { quiz_type, title, attempted_at, overall_remark, result_json } = resultData;

  const dateFormatted = attempted_at
    ? new Date(attempted_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "";

  let interpretation =
    (overall_remark && overall_remark !== "Assessment completed" ? overall_remark : null) ||
    result_json?.interpretation ||
    result_json?.final_classification;

  if (!interpretation && quiz_type === "EI") {
    const compInterps = result_json?.competency_interpretations || {};
    const strengths = Object.values(compInterps).filter((v) => v === "Strength").length;
    interpretation = strengths > 0 ? `${strengths} Strengths` : "Above Average EI";
  }

  interpretation = interpretation || "Completed";

  let totalScore = resultData.total_score ?? result_json?.total_score ?? null;
  let maxScore = result_json?.max_possible ?? null;

  let description = "";
  let competencies = [];
  let isFormBased = false;
  let formA = [];
  let formB = [];

  if (quiz_type === "SCQ") {
    maxScore = maxScore || 240;
    description =
      "You have evaluated your physical, social, temperamental, educational, moral, and intellectual self-concept. A higher score reflects a positive self-identity.";
    const dimScores = result_json?.dimension_scores || {};
    competencies = [
      { name: "Physical Self", score: dimScores.A_Physical || 0, max: 40 },
      { name: "Social Self", score: dimScores.B_Social || 0, max: 40 },
      { name: "Temperamental Self", score: dimScores.C_Temperamental || 0, max: 40 },
      { name: "Educational Self", score: dimScores.D_Educational || 0, max: 40 },
      { name: "Moral Self", score: dimScores.E_Moral || 0, max: 40 },
      { name: "Intellectual Self", score: dimScores.F_Intellectual || 0, max: 40 },
    ];
  } else if (quiz_type === "GWBS") {
    maxScore = maxScore || 275;
    description =
      "Your general well-being score reflects your emotional stability, social connectedness, school experience, and physical health balance.";
    const dimScores = result_json?.dimension_scores || {};
    competencies = [
      { name: "Physical Well-being", score: dimScores.A_Physical || 0, max: 55 },
      { name: "Emotional Well-being", score: dimScores.B_Emotional || 0, max: 70 },
      { name: "Social Well-being", score: dimScores.C_Social || 0, max: 85 },
      { name: "School Well-being", score: dimScores.D_School || 0, max: 65 },
    ];
  } else if (quiz_type === "TABBPS") {
    isFormBased = true;
    const formAFactors = result_json?.form_a_factor_scores || {};
    const formBFactors = result_json?.form_b_factor_scores || {};
    const formAScore = result_json?.form_a_score || 0;
    const formBScore = result_json?.form_b_score || 0;

    totalScore = formAScore + formBScore;
    maxScore = 165;

    description =
      "Your responses analyze your behavioral traits across Form A (Type A characteristics) and Form B (Type B characteristics). " +
      `Form A score: ${formAScore} (${result_json?.form_a_interpretation || ''}), Form B score: ${formBScore} (${result_json?.form_b_interpretation || ''}).`;

    const factorAMax = { I: 20, II: 10, III: 15, IV: 15, V: 15, VI: 10 };
    const factorBMax = { I: 20, II: 15, III: 15, IV: 15, V: 15 };

    formA = Object.keys(factorAMax).map((f) => ({
      name: `Factor - ${f}`,
      score: formAFactors[f] || 0,
      max: factorAMax[f]
    }));

    formB = Object.keys(factorBMax).map((f) => ({
      name: `Factor - ${f}`,
      score: formBFactors[f] || 0,
      max: factorBMax[f]
    }));
  } else if (quiz_type === "EI") {
    const compScores = result_json?.competency_scores || {};
    const compInterps = result_json?.competency_interpretations || {};

    const sumScore = Object.values(compScores).reduce((a, b) => a + b, 0);
    totalScore = sumScore;
    maxScore = 250;

    description =
      "Emotional Intelligence evaluates five core dimensions: Self Awareness, Managing Emotions, Motivating Oneself, Empathy, and Social Skill.";

    const compNames = [
      { key: "Self_Awareness", name: "Self Awareness" },
      { key: "Managing_Emotions", name: "Managing Emotions" },
      { key: "Motivating_Oneself", name: "Motivating Oneself" },
      { key: "Empathy", name: "Empathy" },
      { key: "Social_Skill", name: "Social Skill" },
    ];

    competencies = compNames.map((c) => ({
      name: `${c.name} (${compInterps[c.key] || 'Evaluated'})`,
      score: compScores[c.key] || 0,
      max: 50
    }));
  }

  const calculatePercentage = (score, max) => (max ? (score / max) * 100 : 0);

  const CircularProgress = ({ score, max }) => {
    if (score === null || max === null || !max) return null;
    const percentage = Math.min(100, Math.max(0, calculatePercentage(score, max)));
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/20" />
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="text-white drop-shadow-md" strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-white font-sans leading-none">{score}</span>
          <span className="text-[10px] text-white/80 font-medium">/{max}</span>
        </div>
      </div>
    );
  };

  const renderCompetencyCard = (comp, index) => (
    <div key={index} className="bg-[#F8FFF9] border border-[#C5E1D4] rounded-xl p-4 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-sans font-medium text-[#3E4F45] text-sm pr-2">{comp.name}</h3>
        <div className="text-right whitespace-nowrap">
          <span className="text-xl font-semibold text-black font-sans">{comp.score}</span>
          <span className="text-[10px] text-gray-500 font-semibold ml-0.5">/{comp.max}</span>
        </div>
      </div>
      <div className="w-full bg-[#C5E1D4] h-2.5 rounded-full overflow-hidden">
        <div 
          className="bg-[#386641] h-full rounded-full transition-all duration-500" 
          style={{ width: `${calculatePercentage(comp.score, comp.max)}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col font-sans">
      <div className="mb-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#386641] font-serif leading-none mb-2">
          Quiz Results
        </h1>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          {title || quiz_type} <span className="mx-1">•</span> {dateFormatted}
        </p>
        
        <div className="flex gap-16 mt-6 ml-2">
          <h2 className="text-lg font-semibold text-black font-serif">{studentInfo.name}</h2>
          {studentInfo.enrollment && (
            <h2 className="text-lg font-semibold text-black font-serif">{studentInfo.enrollment}</h2>
          )}
        </div>
      </div>

      <div className="flex gap-8 flex-1">
        {/* Left Column: Competencies */}
        <div className="flex-1">
          {isFormBased ? (
            <div className="flex flex-col gap-6 pr-4 pb-10 overflow-y-auto max-h-[calc(100vh-250px)]">
              <div>
                <h3 className="text-xl font-semibold text-black font-sans mb-4">Form A (Type A Factors)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {formA.map((comp, index) => renderCompetencyCard(comp, index))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black font-sans mb-4">Form B (Type B Factors)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {formB.map((comp, index) => renderCompetencyCard(comp, index))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 pr-4">
              {competencies.map((comp, index) => renderCompetencyCard(comp, index))}
            </div>
          )}
        </div>

        {/* Right Column: Overall Score & Description */}
        <div className="w-[320px] shrink-0 flex flex-col gap-6">
          {/* Score Card */}
          <div className="bg-[#3A7654] rounded-2xl p-6 shadow-md flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-[#A7C957] font-sans leading-tight pr-2">
              {interpretation.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {word}
                  <br />
                </React.Fragment>
              ))}
            </h2>
            {totalScore !== null && (
              <CircularProgress score={totalScore} max={maxScore} />
            )}
          </div>

          {/* Description Container */}
          <div className="bg-[#CFD8CD] rounded-2xl flex-1 relative overflow-hidden shadow-sm p-6 flex flex-col">
            <div className="relative z-10 flex-1 flex flex-col mb-20">
              <h3 className="text-xl font-semibold text-[#386641] font-serif mb-3">Detailed Insight</h3>
              <p className="text-[#3E4F45] text-sm font-medium leading-relaxed">
                {description}
              </p>
            </div>
            
            <div className="absolute right-4 bottom-4 w-24 h-24 opacity-80 pointer-events-none">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10 C70 10, 90 30, 90 50 C90 70, 70 90, 50 90 C30 90, 10 70, 10 50 C10 30, 30 10, 50 10 Z" fill="#E27655" opacity="0.2"/>
                <path d="M40 40 L60 60 M60 40 L40 60" stroke="#386641" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="50" cy="50" r="30" stroke="#A7C957" strokeWidth="4" strokeDasharray="10 5"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentQuizResults;

