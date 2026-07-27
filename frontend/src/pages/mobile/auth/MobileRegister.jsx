import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../../assets/icons/logo.png";
import API from "../../../api/axios";

const MobileRegister = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    enrollment_no: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    course: "",
    semester: "",
    session: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validate = () => {
    let err = {};

    if (!formData.name.trim()) err.name = "Enter your name";

    if (!formData.enrollment_no.trim())
      err.enrollment_no = "Enter enrollment number";

    if (!formData.email.trim()) err.email = "Enter email";

    if (
      formData.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    )
      err.email = "Invalid email";

    if (!/^[6-9]\d{9}$/.test(formData.phone)) err.phone = "Enter valid phone";

    if (!formData.gender) err.gender = "Select gender";

    if (!formData.course) err.course = "Select course";

    if (!formData.semester) err.semester = "Select semester";

    if (!formData.session) err.session = "Select session";

    if (formData.password.length < 8) err.password = "Minimum 8 characters";

    if (formData.password !== formData.confirmPassword)
      err.confirmPassword = "Passwords don't match";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await API.post("/auth/register/student", {
        enrollment_no: formData.enrollment_no,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        course: formData.course,
        semester: Number(formData.semester),
        session: formData.session,
        password: formData.password,
      });

      alert("Registration Successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#16342F] flex items-center justify-center p-4">
      <div className="w-[92vw] max-w-[980px] h-auto min-h-[550px] my-4 bg-white rounded-2xl shadow-2xl overflow-hidden grid lg:grid-cols-[40%_60%]">
        
        {/* LEFT PANEL */}
        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#0E3B34] via-[#1D5C4F] to-[#3D8B73]">
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-52 h-52 rounded-full bg-white/10"></div>
          <div className="absolute bottom-0 -right-20 w-52 h-52 rounded-full bg-white/10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-white/5"></div>

          <div className="relative z-10 flex flex-col justify-center items-center w-full px-8 text-center">
            <div className="flex items-center justify-center">
              <div className="bg-white rounded-full p-1.5 shadow-lg">
                <img
                  src={logo}
                  alt="Manomitra Logo"
                  className="w-28 h-28 object-contain"
                />
              </div>
            </div>

            <h1 className="mt-4 text-2xl font-serif font-extrabold text-[#E9F7EF]">ManoMitra</h1>
            <p className="mt-1 text-xs font-semibold text-green-100">Friend of the Mind</p>

            <p className="mt-5 text-center text-[11px] leading-5 text-green-50 max-w-xs">
              A safe space designed for IIPS students to participate in wellness
              events, counselling sessions, workshops and mental health quizzes.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col justify-center px-8 py-8 lg:px-12">
          <div className="lg:hidden flex flex-col items-center mb-5">
            <div className="w-14 h-14 rounded-full bg-[#D9F99D] flex items-center justify-center">
              <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
            </div>
            <h2 className="text-base font-bold text-[#1D5C4F] mt-1">
              Manomitra
            </h2>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-[#194D42]">
            Student Registration
          </h2>

          <p className="text-gray-500 mt-1 mb-5 text-xs">
            Create your account to continue.
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-3.5 gap-y-2.5">
            
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-3 py-1.5 rounded-lg text-xs border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#2F6F5E] focus:ring-4 focus:ring-[#2F6F5E]/20 outline-none transition"
              />

              {errors.name && (
                <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Enrollment */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Enrollment Number
              </label>

              <input
                type="text"
                name="enrollment_no"
                value={formData.enrollment_no}
                onChange={handleChange}
                placeholder="Enrollment Number"
                className="w-full px-3 py-1.5 rounded-lg text-xs border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#2F6F5E] focus:ring-4 focus:ring-[#2F6F5E]/20 outline-none transition"
              />

              {errors.enrollment_no && (
                <p className="text-red-500 text-[10px] mt-0.5 font-medium">
                  {errors.enrollment_no}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                placeholder="9876543210"
                className="w-full px-3 py-1.5 rounded-lg text-xs border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#2F6F5E] focus:ring-4 focus:ring-[#2F6F5E]/20 outline-none transition"
              />

              {errors.phone && (
                <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@iips.edu.in"
                className="w-full px-3 py-1.5 rounded-lg text-xs border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#2F6F5E] focus:ring-4 focus:ring-[#2F6F5E]/20 outline-none transition"
              />

              {errors.email && (
                <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-1.5 rounded-lg text-xs border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#2F6F5E] focus:ring-4 focus:ring-[#2F6F5E]/20 outline-none transition"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              {errors.gender && (
                <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.gender}</p>
              )}
            </div>

            {/* Course */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Course
              </label>

              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-3 py-1.5 rounded-lg text-xs border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#2F6F5E] focus:ring-4 focus:ring-[#2F6F5E]/20 outline-none transition"
              >
                <option value="">Select Course</option>
                <option value="M.Tech IT">M.Tech IT</option>
                <option value="M.Tech CSE">M.Tech CSE</option>
                <option value="MBA">MBA</option>
                <option value="MCA">MCA</option>
                <option value="B.Com">B.Com</option>
              </select>

              {errors.course && (
                <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.course}</p>
              )}
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Semester
              </label>

              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3 py-1.5 rounded-lg text-xs border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#2F6F5E] focus:ring-4 focus:ring-[#2F6F5E]/20 outline-none transition"
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>

              {errors.semester && (
                <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.semester}</p>
              )}
            </div>

            {/* Session */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Academic Session
              </label>

              <select
                name="session"
                value={formData.session}
                onChange={handleChange}
                className="w-full px-3 py-1.5 rounded-lg text-xs border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#2F6F5E] focus:ring-4 focus:ring-[#2F6F5E]/20 outline-none transition"
              >
                <option value="">Select Session</option>
                <option value="2023-2028">2023-2028</option>
                <option value="2024-2029">2024-2029</option>
                <option value="2025-2030">2025-2030</option>
              </select>

              {errors.session && (
                <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.session}</p>
              )}
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#2F6F5E] focus:ring-4 focus:ring-[#2F6F5E]/20 outline-none transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2F6F5E]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#2F6F5E] focus:ring-4 focus:ring-[#2F6F5E]/20 outline-none transition"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2F6F5E]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-[10px] mt-0.5 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 mt-2 bg-gradient-to-r from-[#1B5E54] via-[#2F7D68] to-[#47A37F] hover:from-[#174E45] hover:via-[#296C5A] hover:to-[#3D9070] text-white py-2 rounded-lg font-bold text-xs shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-5">
            <p className="text-gray-600 text-xs font-medium">Already have an account?</p>

            <Link
              to="/login"
              className="inline-block mt-1 text-[#1B5E54] font-bold hover:underline text-xs"
            >
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileRegister;