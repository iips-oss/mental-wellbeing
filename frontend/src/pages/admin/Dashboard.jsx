import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Calendar, Users, Award, Shield } from "lucide-react";
import AuthService from "../../services/auth";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 useEffect(() => {
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const responseData = await AuthService.getAdminDashboard();
      setData(responseData);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError(
        err.response?.data?.detail ||
        "Failed to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

  const handleDownloadSummary = () => {
    if (!data) return;
    const csvContent = 
      `Manomitra mental well-being platform summary\n` +
      `Admin: ${data.admin_name}\n` +
      `Department: ${data.department}\n` +
      `---------------------------------------\n` +
      `Total Events: ${data.stats.total_events}\n` +
      `Total Quizzes: ${data.stats.total_quizzes}\n` +
      `Total Students: ${data.stats.total_students}\n` +
      `Average Well-being: ${data.stats.avg_wellbeing}\n\n` +
      `Events Summary:\n` +
      `Event,Quizzes,Date,Attendees,Performance\n` +
      data.events_summary.map(e => `"${e.title}","${e.quizzes_count}","${e.event_date}",${e.attendees_count},"${e.performance}"`).join("\n");
      
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "manomitra_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col justify-center items-center h-full gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#386641]"></div>
        <p className="text-gray-500 font-medium">Gathering well-being metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 max-w-md">
          <h3 className="font-bold text-lg mb-2 font-serif">Error Loading Dashboard</h3>
          <p className="font-sans">{error || "An unexpected error occurred."}</p>
        </div>
      </div>
    );
  }

  const { stats, events_summary } = data;

  const statCards = [
    { title: "Total Events", value: stats.total_events, icon: Calendar },
    { title: "Total Quizzes", value: stats.total_quizzes, icon: Shield },
    { title: "Total Students", value: stats.total_students, icon: Users },
    { title: "Average Well-being", value: stats.avg_wellbeing, icon: Award }
  ];

  return (
    <div className="w-full h-full flex flex-col font-sans">
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#386641] font-serif leading-none mb-2">
            Welcome, {data.admin_name.split(' ')[0] || "Yasmin"}
          </h1>
          <p className="text-sm text-[#9DB1A3] font-medium">
            {data.department}
          </p>
        </div>
        <button
          onClick={handleDownloadSummary}
          className="flex items-center gap-2 bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download Summary
        </button>
      </div>

      <div className="bg-[#F3F2F2] rounded-3xl p-8 flex-1 overflow-auto">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-[#E5E5E5] border border-[#2F3C36] rounded-xl p-6 flex flex-col justify-between h-[150px] relative overflow-hidden group hover:border-[#386641] transition-colors"
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold text-black tracking-wide font-serif">
                    {card.title}
                  </span>
                  <div className="p-2 bg-white rounded-lg border border-[#2F3C36]/20">
                    <Icon className="w-5 h-5 text-[#3A8458]" />
                  </div>
                </div>
                <div className="text-4xl font-extrabold text-[#386641] tracking-tight mt-4 font-sans">
                  {card.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Events Summary Section */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#386641] font-serif">Events Summary</h2>
            <Link
              to="/admin/events"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#3A8458] hover:text-[#2E7D4F] transition-colors group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {events_summary.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-sans font-semibold">
              No events registered yet.
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="grid grid-cols-12 gap-4 px-6 pb-4 border-b border-black/10 font-serif font-semibold text-black">
                <div className="col-span-5">Event</div>
                <div className="col-span-2 text-center">Quizzes</div>
                <div className="col-span-2 text-center">Date</div>
                <div className="col-span-2 text-center">Attendees</div>
                <div className="col-span-1 text-right pr-2">Performance</div>
              </div>
              <div className="flex flex-col gap-4 mt-6">
                {events_summary.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="grid grid-cols-12 gap-4 items-center bg-[#E5E5E5] border border-[#2F3C36] rounded-xl px-6 py-4"
                  >
                    <div className="col-span-5">
                      <div className="text-[#3A8458] font-sans font-medium text-lg truncate pr-2">
                        {event.title}
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center text-[#3E4F45] text-sm">
                      {event.quizzes_count}
                    </div>

                    <div className="col-span-2 text-center text-[#3E4F45] text-sm mb-0.5">
                      {new Date(event.event_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </div>

                    <div className="col-span-2 text-center">
                      <span className="text-[#3A8458] text-sm font-medium">
                        {event.attendees_count} Attendees
                      </span>
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        event.performance === "High"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : event.performance === "Average"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : event.performance === "Low"
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : "bg-gray-50 text-gray-500 border border-gray-100"
                      }`}>
                        {event.performance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
