import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../../assets/icons/logo.png";
import API from "../../../api/axios";

const MobileResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    if (!newPassword) {
      setError("New password is required");
      return false;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Reset token is missing from the link URL.");
      return;
    }

    if (!validate()) return;

    try {
      setLoading(true);
      const response = await API.post("/auth/reset-password", {
        token,
        new_password: newPassword,
      });
      setSuccess(response.data?.message || "Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

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
              Welcome back to Manomitra. Login to continue your mental wellbeing journey, attend workshops, counselling sessions, and wellbeing events.
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

          <h2 className="text-2xl lg:text-3xl font-extrabold leading-none text-[#143E36]">
            Reset Password
          </h2>

          <p className="mt-1 mb-6 text-xs text-gray-500">
            Set your new password below
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 text-xs px-4 py-3 rounded-lg font-medium">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-xs px-4 py-3 rounded-lg font-medium">
                {error}
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-700">
                New Password :
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs pr-10 outline-none transition-all duration-300 focus:border-[#1D5C4F] focus:bg-white focus:ring-4 focus:ring-[#1D5C4F]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1D5C4F]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-700">
                Confirm Password :
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs pr-10 outline-none transition-all duration-300 focus:border-[#1D5C4F] focus:bg-white focus:ring-4 focus:ring-[#1D5C4F]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1D5C4F]"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-[#164C40] via-[#2F7D68] to-[#52A98A] py-2 text-xs font-bold text-white shadow transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            {/* Back to Login */}
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs font-bold text-[#1D5C4F] hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default MobileResetPassword;
