import React, { useState } from "react";
import { User, Mail, Lock, CheckCircle } from "lucide-react";
import AuthService from "../../../services/auth";

const MobileAdminProfile = () => {
  const [profile, setProfile] = useState({
    name: "Dr. Yasmin Sheikh",
    email: "yasmin.sheikh@davv.edu.in",
    department: "Senior Technical Faculty, IIPS DAVV"
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [message, setMessage] = useState("");

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setMessage("Profile updated successfully");
    setTimeout(() => setMessage(""), 3000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setMessage("Passwords do not match");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    setMessage("Password changed successfully");
    setPassword({ current: "", new: "", confirm: "" });
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="w-full h-full flex flex-col font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#386641] font-serif leading-none mb-2">
          Profile Settings
        </h1>
        <p className="text-sm text-[#9DB1A3] font-medium">
          Manage your account details and security
        </p>
      </div>

      <div className="bg-[#F3F2F2] rounded-3xl p-8 flex-1 overflow-auto">
        {message && (
          <div className="mb-6 bg-emerald-50 text-[#386641] p-4 rounded-xl border border-[#73D38F] flex items-center gap-2 font-medium">
            <CheckCircle className="w-5 h-5" />
            {message}
          </div>
        )}

        <div className="flex flex-col gap-8">
          <div className="bg-[#E5E5E5] border border-[#2F3C36] rounded-xl p-5 sm:p-8">
            <h2 className="text-xl font-bold text-[#386641] font-serif mb-6 flex items-center gap-2">
              <User className="w-6 h-6" />
              Personal Information
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-2xl">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1.5 font-sans">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full border border-[#2F3C36]/20 rounded-lg px-4 py-2.5 bg-[#F3F2F2] focus:outline-none focus:ring-2 focus:ring-[#386641]/50 text-[#3E4F45]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1.5 font-sans">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full border border-[#2F3C36]/20 rounded-lg px-4 py-2.5 bg-[#F3F2F2] focus:outline-none focus:ring-2 focus:ring-[#386641]/50 text-[#3E4F45]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1.5 font-sans">Department</label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => setProfile({...profile, department: e.target.value})}
                  className="w-full border border-[#2F3C36]/20 rounded-lg px-4 py-2.5 bg-[#F3F2F2] focus:outline-none focus:ring-2 focus:ring-[#386641]/50 text-[#3E4F45]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors mt-2"
              >
                Save Changes
              </button>
            </form>
          </div>

          <div className="bg-[#E5E5E5] border border-[#2F3C36] rounded-xl p-5 sm:p-8">
            <h2 className="text-xl font-bold text-[#386641] font-serif mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6" />
              Security Settings
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-semibold text-black mb-1.5 font-sans">Current Password</label>
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword({...password, current: e.target.value})}
                  className="w-full border border-[#2F3C36]/20 rounded-lg px-4 py-2.5 bg-[#F3F2F2] focus:outline-none focus:ring-2 focus:ring-[#386641]/50 text-[#3E4F45]"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1.5 font-sans">New Password</label>
                  <input
                    type="password"
                    value={password.new}
                    onChange={(e) => setPassword({...password, new: e.target.value})}
                    className="w-full border border-[#2F3C36]/20 rounded-lg px-4 py-2.5 bg-[#F3F2F2] focus:outline-none focus:ring-2 focus:ring-[#386641]/50 text-[#3E4F45]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1.5 font-sans">Confirm Password</label>
                  <input
                    type="password"
                    value={password.confirm}
                    onChange={(e) => setPassword({...password, confirm: e.target.value})}
                    className="w-full border border-[#2F3C36]/20 rounded-lg px-4 py-2.5 bg-[#F3F2F2] focus:outline-none focus:ring-2 focus:ring-[#386641]/50 text-[#3E4F45]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors mt-2"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAdminProfile;
