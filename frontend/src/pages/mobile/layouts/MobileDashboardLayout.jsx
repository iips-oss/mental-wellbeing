import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, FileText, User, LogOut } from "lucide-react";
import AuthService from "../../../services/auth";

const MobileDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminInfo, setAdminInfo] = useState({
    name: "Dr. Yasmin Sheikh",
    department: "Senior Technical Faculty, IIPS DAVV"
  });

  useEffect(() => {
    AuthService.getMe()
      .then((data) => {
        setAdminInfo({
          name: data.name || "Dr. Yasmin Sheikh",
          department: data.department || "Senior Technical Faculty, IIPS DAVV"
        });
      })
      .catch((err) => {
        console.error("Error fetching admin profile info:", err);
      });
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Events", path: "/admin/events", icon: Calendar },
    { name: "Manage Quizzes", path: "/admin/quizzes", icon: FileText },
    { name: "Profile", path: "/admin/profile", icon: User }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      {/* Top Header for Mobile */}
      <aside className="w-full bg-[#386641] text-white flex flex-col shrink-0 select-none shadow-xl relative z-10 rounded-b-[20px] overflow-hidden">
        <div className="flex flex-col">
          {/* Logo Section & Top Right Actions */}
          <div className="flex items-center justify-between p-4 mb-1 border-b border-[#477250]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#A7C957] flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-[#386641]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#FBEBC3] font-serif leading-none">Manomitra</h1>
                <p className="text-[10px] text-[#8AA38E] mt-1 font-medium">Friend of the mind</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="p-2 text-[#DFD9C9] hover:text-[#FBEBC3] bg-[#2d5134] rounded-full shadow-inner transition-all duration-200"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Links - Horizontal Scroll */}
          <nav className="flex overflow-x-auto gap-2 px-3 py-3 no-scrollbar items-center">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-250 whitespace-nowrap ${
                    isActive
                      ? "bg-[#477250] text-[#FBEBC3] font-semibold shadow-inner"
                      : "text-[#DFD9C9] hover:text-white bg-[#2d5134]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#FBEBC3]" : "text-[#DFD9C9]"}`} />
                  <span className="text-sm tracking-wide font-sans">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto p-4 bg-[#FAF8F5]">
        <Outlet />
      </main>
    </div>
  );
};

export default MobileDashboardLayout;
