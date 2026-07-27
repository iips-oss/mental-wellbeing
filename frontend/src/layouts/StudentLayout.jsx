import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, FileText, User, LogOut } from "lucide-react";
import AuthService from "../services/auth";

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentInfo, setStudentInfo] = useState({
    name: "Anirudh Saksena",
    course: "Bachelors Computer Applications"
  });

  useEffect(() => {
    AuthService.getMe()
      .then((data) => {
        setStudentInfo({
          name: data.name || "Anirudh Saksena",
          course: data.course || "Bachelors Computer Applications"
        });
      })
      .catch((err) => {
        console.error("Error fetching student profile info:", err);
      });
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { name: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
    { name: "My Quizzes", path: "/student/quizzes", icon: FileText },
    { name: "Events & Workshops", path: "/student/events", icon: Calendar },
    { name: "Profile", path: "/student/profile", icon: User }
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      {/* Sidebar */}
      <aside className="w-[300px] bg-[#386641] text-white flex flex-col justify-between shrink-0 select-none shadow-xl relative z-10 rounded-r-[40px] overflow-hidden">
        <div>
          {/* Logo Section */}
          <div className="flex items-center gap-3 p-6 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#A7C957] flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-[#386641]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#FBEBC3] font-serif leading-none">Manomitra</h1>
              <p className="text-xs text-[#8AA38E] mt-1 font-medium">Friend of the mind</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              // Add special logic for nested routes (e.g., /student/quizzes/1/attempt) so "My Quizzes" stays active
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-250 relative overflow-hidden group ${
                    isActive
                      ? "bg-[#477250] text-[#FBEBC3] font-semibold"
                      : "text-[#DFD9C9] hover:text-white hover:bg-[#3f7049]"
                  }`}
                >
                  {/* Left Yellow-Green Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#A7C957] rounded-r-md"></span>
                  )}
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#FBEBC3]" : "text-[#DFD9C9]"}`} />
                  <span className="text-base tracking-wide font-sans">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile section */}
        <div className="p-4 border-t border-[#477250] bg-[#2d5134] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-[#A7C957] flex items-center justify-center shrink-0 shadow-inner text-[#386641]">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold truncate text-[#FBEBC3]" title={studentInfo.name}>
                {studentInfo.name}
              </h4>
              <p className="text-[10px] text-[#8AA38E] truncate" title={studentInfo.course}>
                {studentInfo.course}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-[#DFD9C9] hover:text-[#FBEBC3] hover:bg-[#477250] rounded-xl transition-all duration-200 shrink-0"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main 
        className="flex-1 overflow-y-auto h-screen p-8 bg-[#FDFBF7]"
        style={{
          backgroundImage: "url('/leaves.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
