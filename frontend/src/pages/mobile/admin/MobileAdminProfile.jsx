import React, { useEffect, useState } from "react";
import { User, CheckCircle } from "lucide-react";
import AuthService from "../../../services/auth";

const MobileAdminProfile = () => {
  const [profile, setProfile] = useState({ name: "", email: "", department: "" });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const data = await AuthService.getMe();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          department: data.department || ""
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        setLoadError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setMessage("");
    try {
      const updated = await AuthService.updateProfile({
        name: profile.name,
        email: profile.email,
        department: profile.department
      });
      setProfile({
        name: updated.name || "",
        email: updated.email || "",
        department: updated.department || ""
      });
      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setSaveError(
        err?.response?.data?.detail || "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#386641] font-serif leading-none mb-2">
          Profile Settings
        </h1>
        <p className="text-sm text-[#9DB1A3] font-medium">
          Manage your account details
        </p>
      </div>

      <div className="bg-[#F3F2F2] rounded-3xl p-8 flex-1 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#386641]"></div>
            <p className="text-gray-500 font-medium">Loading profile...</p>
          </div>
        ) : loadError ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100 font-semibold">
            {loadError}
          </div>
        ) : (
          <>
            {message && (
              <div className="mb-6 bg-emerald-50 text-[#386641] p-4 rounded-xl border border-[#73D38F] flex items-center gap-2 font-medium">
                <CheckCircle className="w-5 h-5" />
                {message}
              </div>
            )}
            {saveError && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100 font-semibold">
                {saveError}
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
                        required
                        className="w-full border border-[#2F3C36]/20 rounded-lg px-4 py-2.5 bg-[#F3F2F2] focus:outline-none focus:ring-2 focus:ring-[#386641]/50 text-[#3E4F45]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1.5 font-sans">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        required
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
                    disabled={saving}
                    className="bg-[#2E7D4F] hover:bg-[#256641] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors mt-2 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileAdminProfile;
