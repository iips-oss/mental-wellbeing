import { Link, useNavigate } from "react-router-dom";
import { User, ShieldCheck } from "lucide-react";
import logo from "../../assets/icons/logo.png";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#16342F] flex items-center justify-center p-4">
      <div className="w-[92vw] max-w-[980px] h-auto min-h-[550px] my-4 bg-white rounded-2xl shadow-2xl overflow-hidden grid lg:grid-cols-[40%_60%]">
        
        {/* LEFT PANEL */}
        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#0B3B33] via-[#1E6655] to-[#4DA387]">
          <div className="absolute -top-20 -left-20 w-52 h-52 rounded-full bg-white/10"></div>
          <div className="absolute bottom-0 -right-20 w-52 h-52 rounded-full bg-white/10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-white/5"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center w-full px-8 text-center">
            <div className="bg-white rounded-full p-1.5 shadow-lg">
              <img
                src={logo}
                alt="logo"
                className="w-28 h-28 object-contain"
              />
            </div>

            <h1 className="mt-4 text-2xl font-serif font-bold text-[#E9F7EF]">
              ManoMitra
            </h1>

            <p className="mt-1 text-xs font-semibold text-green-100">
              Friend of the Mind
            </p>

            <p className="mt-5 text-center text-[11px] leading-5 text-green-50 max-w-xs">
              Welcome to Manomitra. Please select your role to continue to the appropriate portal.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col justify-center px-8 py-8 lg:px-12">
          <div className="lg:hidden flex justify-center mb-5">
            <div className="bg-white rounded-full p-1.5 shadow-md">
              <img
                src={logo}
                alt="logo"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold leading-none text-[#143E36] text-center mb-2">
            Choose Your Role
          </h2>
          <p className="text-xs text-gray-500 text-center mb-10">
            Are you logging in as a Student or an Admin?
          </p>

          <div className="flex flex-col gap-5 max-w-sm mx-auto w-full">
            {/* Student Role */}
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-4 p-5 rounded-xl border-2 border-gray-100 bg-white shadow-sm hover:border-[#1D5C4F] hover:bg-[#F3FAF6] hover:shadow-md transition-all duration-300 group text-left"
            >
              <div className="bg-[#E8F5EC] p-3 rounded-full text-[#1D5C4F] group-hover:scale-110 transition-transform duration-300">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-[#143E36] font-bold text-lg">Student</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">Access your dashboard, take quizzes, and view events.</p>
              </div>
            </button>

            {/* Admin Role */}
            <button
              onClick={() => navigate('/admin/login')}
              className="flex items-center gap-4 p-5 rounded-xl border-2 border-gray-100 bg-white shadow-sm hover:border-[#FF7F50] hover:bg-[#FFF5F0] hover:shadow-md transition-all duration-300 group text-left"
            >
              <div className="bg-[#FFF0E6] p-3 rounded-full text-[#FF7F50] group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-[#143E36] font-bold text-lg">Admin</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">Manage events, track student progress, and view analytics.</p>
              </div>
            </button>
          </div>

          <div className="text-center mt-10">
            <Link to="/" className="text-xs font-semibold text-gray-400 hover:text-[#1D5C4F] hover:underline transition-colors">
              ← Back to Home
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default RoleSelection;
