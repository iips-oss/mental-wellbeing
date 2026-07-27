import React, { useState, useEffect } from "react";
import AuthService from "../../../services/auth";
import { Smile, Brain, ClipboardList, Calendar, Bell } from "lucide-react";

const MobileStudentDashboard = () => {
  const [userName, setUserName] = useState("Anirudh");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    AuthService.getMe()
      .then((data) => setUserName(data.name ? data.name.split(" ")[0] : "Anirudh"))
      .catch((err) => console.error(err));
  }, []);

  const notifications = [
    { id: 1, text: "Your GWBS results are ready to view.", time: "2 hours ago" },
    { id: 2, text: "Upcoming: Yoga Workshop tomorrow at 10 AM.", time: "5 hours ago" },
    { id: 3, text: "You earned a new badge: Consistency!", time: "1 day ago" }
  ];

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

        {/* Notification Button */}
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
        {/* Wellbeing Status Card */}
        <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F3EB] flex items-center justify-center shrink-0">
            <Smile className="w-6 h-6 text-[#3A8458]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 tracking-wide font-serif mb-1">Wellbeing Status</div>
            <div className="text-2xl font-semibold text-[#386641] font-sans">Above Average</div>
            <div className="text-xs text-[#386641] font-medium mt-1">Based on latest GWBS</div>
          </div>
        </div>

        {/* Personality Type Card */}
        <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F4F1E1] flex items-center justify-center shrink-0">
            <Brain className="w-6 h-6 text-[#8A7B52]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 tracking-wide font-serif mb-1">Personality Type</div>
            <div className="text-2xl font-semibold text-[#386641] font-sans">Type B</div>
            <div className="text-xs text-[#8A7B52] font-medium mt-1">Latest TABBPS</div>
          </div>
        </div>

        {/* Assessments Completed Card */}
        <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF5E5] flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6 text-[#F5A623]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 tracking-wide font-serif mb-1">Assessments Completed</div>
            <div className="text-2xl font-semibold text-[#386641] font-sans">4 / 4</div>
            <div className="text-xs text-[#F5A623] font-medium mt-1">This semester</div>
          </div>
        </div>

        {/* Next Event Card */}
        <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E2EFE9] flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-[#2A523D]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 tracking-wide font-serif mb-1">Next Event</div>
            <div className="text-2xl font-semibold text-[#386641] font-sans truncate max-w-[120px]">Yoga Workshop</div>
            <div className="text-xs text-gray-500 font-medium mt-1">Tomorrow • 10:00 AM</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        {/* Left Column: Wellbeing Overview Chart */}
        <div className="flex-[2] bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-[#386641] font-serif">Wellbeing Overview</h3>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-gray-500 mb-1">Average Wellbeing Score</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-semibold text-[#1E3A2F]">68%</span>
                <span className="bg-[#E8F3EB] text-[#386641] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  ↑ 12%
                </span>
              </div>
              <span className="text-xs text-gray-400 mt-1">vs last month</span>
            </div>
          </div>

          <div className="flex-1 relative bg-[#FDFBF7] rounded-xl overflow-hidden mt-2 p-4 border border-gray-50">
            {/* Simple SVG Line Chart Placeholder */}
            <svg viewBox="0 0 400 150" className="w-full h-full preserve-3d" preserveAspectRatio="none">
              <path d="M 0 100 L 40 70 L 80 80 L 120 110 L 160 80 L 200 95 L 240 70 L 280 75 L 320 50 L 360 65 L 400 40" fill="none" stroke="#A7C957" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="0" cy="100" r="4" fill="white" stroke="#3A8458" strokeWidth="2" />
              <circle cx="40" cy="70" r="4" fill="white" stroke="#3A8458" strokeWidth="2" />
              <circle cx="80" cy="80" r="4" fill="white" stroke="#3A8458" strokeWidth="2" />
              <circle cx="120" cy="110" r="4" fill="white" stroke="#3A8458" strokeWidth="2" />
              <circle cx="160" cy="80" r="4" fill="white" stroke="#3A8458" strokeWidth="2" />
              <circle cx="200" cy="95" r="4" fill="white" stroke="#3A8458" strokeWidth="2" />
              <circle cx="240" cy="70" r="4" fill="white" stroke="#3A8458" strokeWidth="2" />
              <circle cx="280" cy="75" r="4" fill="white" stroke="#3A8458" strokeWidth="2" />
              <circle cx="320" cy="50" r="4" fill="white" stroke="#3A8458" strokeWidth="2" />
              <circle cx="360" cy="65" r="4" fill="white" stroke="#3A8458" strokeWidth="2" />
              <circle cx="400" cy="40" r="4" fill="white" stroke="#3A8458" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-gray-400">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center px-2">
            <span className="bg-[#E8F3EB] text-[#386641] text-sm font-semibold px-4 py-1.5 rounded-full">Good</span>
            <span className="text-sm font-semibold text-[#1E3A2F] flex items-center gap-1">Keep up the great work! ✨</span>
          </div>
        </div>

        {/* Right Column: Today's Reflection & Recent Activity */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Today's Reflection */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden h-[50%]">
            <h3 className="text-xl font-semibold text-[#386641] font-serif mb-6 relative z-10">Today's Reflection</h3>

            <div className="flex-1 bg-[#F3F9F5] rounded-2xl p-6 flex flex-col justify-center items-center relative z-10">
              <p className="text-[#2A523D] text-xl font-serif text-center font-medium italic mb-4">
                "You're making steady progress."
              </p>
              <div className="text-4xl">🌱</div>
            </div>

            {/* Decorative sticker placeholder */}
            <div className="absolute bottom-4 right-4 w-20 h-20 opacity-80 pointer-events-none -rotate-12 z-20">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10 C70 10, 90 30, 90 50 C90 70, 70 90, 50 90 C30 90, 10 70, 10 50 C10 30, 30 10, 50 10 Z" fill="#A7C957" />
                <circle cx="50" cy="50" r="30" fill="white" />
              </svg>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden flex-1">
            <h3 className="text-xl font-semibold text-[#386641] font-serif mb-4">Recent Activity</h3>
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
