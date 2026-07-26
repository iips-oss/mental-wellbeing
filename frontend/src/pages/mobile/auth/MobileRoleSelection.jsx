import { Link, useNavigate } from "react-router-dom";
import { User, ShieldCheck } from "lucide-react";
import logo from "../../../assets/icons/logo.png";

const MobileRoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col px-6 py-10 font-sans">
      
      {/* Header */}
      <div className="flex justify-center mb-8 mt-4">
        <div className="bg-white rounded-full p-2 shadow-sm border border-gray-100">
          <img
            src={logo}
            alt="logo"
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-extrabold leading-none text-[#143E36] mb-2 font-serif">
          Choose Your Role
        </h2>
        <p className="text-xs text-gray-500 max-w-[250px] mx-auto leading-relaxed">
          Select whether you are logging in as a Student or an Admin to continue.
        </p>
      </div>

      {/* Role Options */}
      <div className="flex flex-col gap-4 w-full flex-grow">
        
        {/* Student Role */}
        <button
          onClick={() => navigate('/login')}
          className="flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-[#1D5C4F] hover:bg-[#F3FAF6] transition-all duration-300 w-full"
        >
          <div className="bg-[#E8F5EC] p-4 rounded-full text-[#1D5C4F] mb-3">
            <User size={32} />
          </div>
          <h3 className="text-[#143E36] font-bold text-lg">Student Portal</h3>
          <p className="text-gray-500 text-xs mt-1 text-center max-w-[200px]">
            Access your dashboard and take wellbeing quizzes
          </p>
        </button>

        {/* Admin Role */}
        <button
          onClick={() => navigate('/admin/login')}
          className="flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-[#FF7F50] hover:bg-[#FFF5F0] transition-all duration-300 w-full"
        >
          <div className="bg-[#FFF0E6] p-4 rounded-full text-[#FF7F50] mb-3">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-[#143E36] font-bold text-lg">Admin Portal</h3>
          <p className="text-gray-500 text-xs mt-1 text-center max-w-[200px]">
            Manage quizzes and track student insights
          </p>
        </button>
      </div>

      <div className="text-center mt-8 pb-4">
        <Link to="/" className="text-xs font-semibold text-gray-400 hover:text-[#1D5C4F] underline-offset-2 hover:underline transition-colors">
          ← Back to Home
        </Link>
      </div>

    </div>
  );
};

export default MobileRoleSelection;
