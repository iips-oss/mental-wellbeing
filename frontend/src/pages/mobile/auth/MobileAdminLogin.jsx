/*use test login Email: yasmin@iips.edu
Password: password123 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await AuthService.login(email, password);
      if (data.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError("Unauthorized. This login panel is for administrators only.");
        AuthService.logout();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      {/* Background decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#A7C957]/10 blur-[80px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#386641]/5 blur-[80px]"></div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl w-full max-w-[450px] relative z-10">
        {/* Logo and title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#A7C957] flex items-center justify-center mb-4 shadow-md">
            <svg className="w-9 h-9 text-[#386641]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#386641] font-serif leading-none">Manomitra</h1>
          <p className="text-sm text-gray-500 mt-2 font-semibold">Administrator Portal</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-sans">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. yasmin@iips.edu"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#386641]/50 focus:border-[#386641] transition-all text-gray-800 font-sans"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-sans">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#386641]/50 focus:border-[#386641] transition-all text-gray-800 font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#386641] hover:bg-[#477250] active:bg-[#2d5134] text-white py-3.5 rounded-xl font-semibold tracking-wide shadow-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2 font-sans"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
