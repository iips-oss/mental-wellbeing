import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthService from "../../../services/auth";

const MobileStudentQuizResults = () => {
  const { id } = useParams();
  const [studentInfo, setStudentInfo] = useState({ name: "Anirudh Saksena", enrollment: "IT-2k23-38" });

  useEffect(() => {
    AuthService.getMe()
      .then((data) => {
        setStudentInfo({
          name: data.name || "Anirudh Saksena",
          enrollment: data.enrollment || "IT-2k23-38"
        });
      })
      .catch((err) => console.error(err));
  }, []);

  // Mock data based on quiz type. In a real app, this would be fetched from the backend using the id.
  const quizType = id === "1" ? "SCQ" : id === "2" ? "GWBS" : id === "3" ? "TABBPS" : id === "4" ? "EI" : "SCQ";
  
  const resultsData = {
    "SCQ": {
      title: "Self Concept",
      event: "Stress Management Workshop",
      date: "6 June 2026 • 2:00 PM",
      interpretation: "Above Average",
      totalScore: 178,
      maxScore: 240,
      description: "You have a positive self-concept and hold a healthy self-image. Your responses indicate a strong foundation in understanding your physical, social, and emotional identity.",
      competencies: [
        { name: "Physical Self", score: 30, max: 40 },
        { name: "Social Self", score: 30, max: 40 },
        { name: "Temperamental Self", score: 30, max: 40 },
        { name: "Educational Self", score: 30, max: 40 },
        { name: "Moral Self", score: 30, max: 40 },
        { name: "Intellectual Self", score: 30, max: 40 }
      ]
    },
    "GWBS": {
      title: "General Well-being",
      event: "Stress Management Workshop",
      date: "6 June 2026 • 2:00 PM",
      interpretation: "High",
      totalScore: 178,
      maxScore: 240,
      description: "Your general well-being is high. You seem to be managing your daily stressors effectively and maintain a positive outlook on life.",
      competencies: [
        { name: "Physical Well-being", score: 30, max: 40 },
        { name: "Emotional Well-being", score: 30, max: 40 },
        { name: "Social Well-being", score: 30, max: 40 },
        { name: "School Well-being", score: 30, max: 40 }
      ]
    },
    "TABBPS": {
      title: "Type A/B Behaviour Pattern",
      event: "Stress Management Workshop",
      date: "6 June 2026 • 2:00 PM",
      interpretation: "Type A",
      totalScore: null, // TABBPS often just categorizes rather than a sum score out of a max, or we can use 178/240
      maxScore: null,
      description: "Your responses strongly align with a Type A personality. You are likely goal-oriented, competitive, and highly organized, but remember to take time to decompress.",
      isFormBased: true,
      formA: [
        { name: "Factor - I", score: 30, max: 40 },
        { name: "Factor - II", score: 30, max: 40 },
        { name: "Factor - III", score: 30, max: 40 },
        { name: "Factor - IV", score: 30, max: 40 },
        { name: "Factor - V", score: 30, max: 40 },
        { name: "Factor - VI", score: 30, max: 40 }
      ],
      formB: [
        { name: "Factor - I", score: 30, max: 40 },
        { name: "Factor - II", score: 30, max: 40 },
        { name: "Factor - III", score: 30, max: 40 },
        { name: "Factor - IV", score: 30, max: 40 },
        { name: "Factor - V", score: 30, max: 40 }
      ]
    },
    "EI": {
      title: "Emotional Intelligence",
      event: "Stress Management Workshop",
      date: "6 June 2026 • 2:00 PM",
      interpretation: "Above Average",
      totalScore: 178,
      maxScore: 240,
      description: "You exhibit strong emotional intelligence. You're well-equipped to manage your own emotions and empathize with others effectively.",
      competencies: [
        { name: "Self Awareness", score: 30, max: 40 },
        { name: "Managing Emotions", score: 30, max: 40 },
        { name: "Motivating Oneself", score: 30, max: 40 },
        { name: "Empathy", score: 30, max: 40 },
        { name: "Social Skill", score: 30, max: 40 }
      ]
    }
  };

  const data = resultsData[quizType];

  const calculatePercentage = (score, max) => (score / max) * 100;

  const CircularProgress = ({ score, max }) => {
    if (score === null || max === null) return null;
    const percentage = calculatePercentage(score, max);
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
          className="bg-[#386641] h-full rounded-full" 
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
          {data.title} <span className="mx-1">•</span> {data.event} <span className="mx-1">•</span> {data.date}
        </p>
        
        <div className="flex flex-col gap-2 mt-4 ml-2">
          <h2 className="text-lg font-semibold text-black font-serif">{studentInfo.name}</h2>
          <h2 className="text-lg font-semibold text-black font-serif">{studentInfo.enrollment}</h2>
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1 mb-8">
        {/* Left Column: Competencies */}
        <div className="flex-1">
          {data.isFormBased ? (
            <div className="flex flex-col gap-6 pr-4 pb-10 overflow-y-auto max-h-[calc(100vh-250px)]">
              <div>
                <h3 className="text-xl font-semibold text-black font-sans mb-4">Form A</h3>
                <div className="flex flex-col gap-4">
                  {data.formA.map((comp, index) => renderCompetencyCard(comp, index))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black font-sans mb-4">Form B</h3>
                <div className="flex flex-col gap-4">
                  {data.formB.map((comp, index) => renderCompetencyCard(comp, index))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pr-2">
              {data.competencies.map((comp, index) => renderCompetencyCard(comp, index))}
            </div>
          )}
        </div>

        {/* Right Column: Overall Score & Description */}
        <div className="w-full shrink-0 flex flex-col gap-6">
          {/* Score Card */}
          <div className="bg-[#3A7654] rounded-2xl p-6 shadow-md flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-[#A7C957] font-sans leading-tight">
              {data.interpretation.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {word}
                  <br />
                </React.Fragment>
              ))}
            </h2>
            {data.totalScore !== null && (
              <CircularProgress score={data.totalScore} max={data.maxScore} />
            )}
          </div>

          {/* Description Container (The Cat area) */}
          <div className="bg-[#CFD8CD] rounded-2xl flex-1 relative overflow-hidden shadow-sm p-6 flex flex-col">
            <div className="relative z-10 flex-1 flex flex-col mb-20">
              <h3 className="text-xl font-semibold text-[#386641] font-serif mb-3">Detailed Insight</h3>
              <p className="text-[#3E4F45] text-sm font-medium leading-relaxed">
                {data.description}
              </p>
            </div>
            
            {/* Placeholder for the Cat sticker */}
            <div className="absolute right-4 bottom-4 w-24 h-24 opacity-80 pointer-events-none">
              {/* Using a simple SVG for now as a generic sticker placeholder */}
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

export default MobileStudentQuizResults;
