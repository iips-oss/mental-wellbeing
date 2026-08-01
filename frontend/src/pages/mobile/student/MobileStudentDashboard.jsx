import React, { useState, useEffect } from "react";
import AuthService from "../../../services/auth";
import StudentService from "../../../services/student";
import { Smile, Brain, ClipboardList, Calendar, Bell } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
const TOTAL_ASSESSMENT_TYPES = 4; // SCQ, GWBS, TABBPS, EI — fixed set

const MobileStudentDashboard = () => {
  const [userName, setUserName] = useState("Student");
  const [showNotifications, setShowNotifications] = useState(false);

  const [assessmentsCompleted, setAssessmentsCompleted] = useState(0);
  const [wellbeingStatus, setWellbeingStatus] = useState(null);
  const [personalityType, setPersonalityType] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [scqHistory, setScqHistory] = useState([]);
  const [currentScqScore, setCurrentScqScore] = useState(null);
  const [latestScqDate, setLatestScqDate] = useState(null);
  useEffect(() => {
    AuthService.getMe()
      .then((data) => setUserName(data.name ? data.name.split(" ")[0] : "Student"))
      .catch((err) => console.error(err));

    AuthService.getNotifications()
      .then((data) => {
        const mapped = (data || []).map((n) => ({
          id: n.id,
          text: n.message,
          time: new Date(n.created_at).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
          }),
        }));
        setNotifications(mapped);
      })
      .catch((err) => console.error("Failed to load notifications:", err));

    const loadDashboardData = async () => {
      try {
        const [dashboard, results, rsvps,scqProgress] = await Promise.all([
          StudentService.getStudentDashboard(),
          StudentService.getMyResults(),
          StudentService.getMyRsvps(),
          StudentService.getScqProgress(),
        ]);

        setAssessmentsCompleted(dashboard?.summary?.total_quizzes ?? 0);

        const sortedResults = [...(results || [])].sort(
          (a, b) => new Date(b.attempted_at) - new Date(a.attempted_at)
        );

        const latestGwbs = sortedResults.find((r) => r.quiz_type === "GWBS");
        if (latestGwbs) {
          setWellbeingStatus(
            latestGwbs.overall_remark || latestGwbs.result_json?.interpretation || null
          );
        }

        const latestTabbps = sortedResults.find((r) => r.quiz_type === "TABBPS");
        if (latestTabbps) {
          setPersonalityType(latestTabbps.result_json?.final_classification || null);
        }

        const upcoming = (rsvps || [])
          .filter((e) => e.status === "scheduled")
          .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

        if (upcoming.length > 0) {
          setNextEvent(upcoming[0]);
        }
        setScqHistory(scqProgress.history || []);
        setCurrentScqScore(scqProgress.current_score);
        setLatestScqDate(scqProgress.latest_event);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col font-sans">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#386641] font-serif leading-none mb-2">
            Good to see you, {userName}
          </h1>
          <h2 className="text-sm text-[#9DB1A3] font-medium">
            How are you doing?
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 bg-white rounded-full shadow-sm border border-gray-100 text-gray-400 hover:text-[#386641] transition-colors cursor-pointer"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-[#FDFBF7] flex justify-between items-center">
                <h3 className="font-semibold text-[#1E3A2F] font-serif">Notifications</h3>
                <span className="text-xs text-[#386641] font-medium cursor-pointer hover:underline">Mark all as read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                    <p className="text-sm font-medium text-[#1E3A2F] mb-1 leading-tight">{n.text}</p>
                    <p className="text-xs text-gray-400">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F3EB] flex items-center justify-center shrink-0">
            <Smile className="w-6 h-6 text-[#3A8458]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 tracking-wide font-serif mb-1">Wellbeing Status</div>
            <div className="text-2xl font-semibold text-[#386641] font-sans">
              {loading ? "…" : wellbeingStatus || "No data yet"}
            </div>
            <div className="text-xs text-[#386641] font-medium mt-1">Based on latest GWBS</div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F4F1E1] flex items-center justify-center shrink-0">
            <Brain className="w-6 h-6 text-[#8A7B52]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 tracking-wide font-serif mb-1">Personality Type</div>
            <div className="text-2xl font-semibold text-[#386641] font-sans">
              {loading ? "…" : personalityType || "No data yet"}
            </div>
            <div className="text-xs text-[#8A7B52] font-medium mt-1">Latest TABBPS</div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF5E5] flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6 text-[#F5A623]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 tracking-wide font-serif mb-1">Assessments Completed</div>
            <div className="text-2xl font-semibold text-[#386641] font-sans">
              {loading ? "…" : `${assessmentsCompleted} / ${TOTAL_ASSESSMENT_TYPES}`}
            </div>
            <div className="text-xs text-[#F5A623] font-medium mt-1">This semester</div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E2EFE9] flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-[#2A523D]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 tracking-wide font-serif mb-1">Next Event</div>
            <div className="text-2xl font-semibold text-[#386641] font-sans truncate max-w-[120px]">
              {loading ? "…" : nextEvent?.title || "None scheduled"}
            </div>
            <div className="text-xs text-gray-500 font-medium mt-1">
              {nextEvent ? `${nextEvent.event_date} • ${nextEvent.event_time}` : ""}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        <div className="flex-[2] bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-[#386641] font-serif">Wellbeing Overview</h3>
            {/* TODO(backend): mocked — no historical wellbeing trend endpoint exists yet */}
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-gray-500 mb-1">
                Current SCQ Score
              </span>

              <span className="text-3xl font-semibold text-[#1E3A2F]">
                {loading
                  ? "..."
                  : currentScqScore !== null
                  ? currentScqScore
                  : "--"}
              </span>

              <span className="text-xs text-gray-400 mt-2">
                {latestScqDate
                  ? `Latest Assessment • ${new Date(latestScqDate).toLocaleDateString()}`
                  : "No SCQ assessment yet"}
              </span>
            </div>
              </div>
         <div className="h-64 relative bg-[#FDFBF7] rounded-xl overflow-hidden mt-2 p-4 border border-gray-50">
  {loading ? (
    <div className="flex items-center justify-center h-full text-gray-400">
      Loading...
    </div>
  ) : scqHistory.length === 0 ? (
    <div className="flex items-center justify-center h-full text-gray-400 text-center px-4">
      Complete an SCQ assessment to view your progress.
    </div>
  ) : (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={scqHistory}
        margin={{
          top: 15,
          right: 20,
          left: -10,
          bottom: 10,
        }}
      >
        <CartesianGrid
          strokeDasharray="4 4"
          vertical={false}
          stroke="#E5E7EB"
        />

        <XAxis
          dataKey="event_name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#6B7280" }}
          tickFormatter={(value) =>
            value.length > 8 ? value.slice(0, 8) + "..." : value
          }
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#6B7280" }}
        />

        <Tooltip
          formatter={(value) => [`${value}`, "SCQ Score"]}
          labelFormatter={(label) => label}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 10px rgba(0,0,0,.08)",
          }}
        />

        <Line
          type="monotone"
          dataKey="score"
          stroke="#A7C957"
          strokeWidth={3}
          dot={{
            r: 4,
            fill: "#FFFFFF",
            stroke: "#3A8458",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 6,
            fill: "#FFFFFF",
            stroke: "#3A8458",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )}
</div>

<div className="mt-4 flex justify-between items-center px-2">
  <span className="bg-[#E8F3EB] text-[#386641] text-sm font-semibold px-4 py-1.5 rounded-full">
    {currentScqScore == null
      ? "No Data"
      : currentScqScore >= 30
      ? "Excellent"
      : currentScqScore >= 20
      ? "Good"
      : "Needs Attention"}
  </span>

  <span className="text-sm font-semibold text-[#1E3A2F] flex items-center gap-1">
    Keep up the great work! ✨
  </span>
</div>
</div>
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden h-[50%]">
            <h3 className="text-xl font-semibold text-[#386641] font-serif mb-6 relative z-10">Today's Reflection</h3>

            <div className="flex-1 bg-[#F3F9F5] rounded-2xl p-6 flex flex-col justify-center items-center relative z-10">
              <p className="text-[#2A523D] text-xl font-serif text-center font-medium italic mb-4">
                "You're making steady progress."
              </p>
              <div className="text-4xl">🌱</div>
            </div>

            <div className="absolute bottom-4 right-4 w-20 h-20 opacity-80 pointer-events-none -rotate-12 z-20">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10 C70 10, 90 30, 90 50 C90 70, 70 90, 50 90 C30 90, 10 70, 10 50 C10 30, 30 10, 50 10 Z" fill="#A7C957" />
                <circle cx="50" cy="50" r="30" fill="white" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden flex-1">
            <h3 className="text-xl font-semibold text-[#386641] font-serif mb-4">Recent Activity</h3>
            {/* TODO(backend): mocked — no notifications/activity endpoint exists yet */}
            <div className="flex flex-col gap-4 overflow-y-auto pr-2">
              {notifications.map(n => (
                <div key={n.id} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-[#A7C957] mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-[#1E3A2F] leading-tight mb-1">{n.text}</p>
                    <p className="text-xs text-gray-400">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileStudentDashboard;