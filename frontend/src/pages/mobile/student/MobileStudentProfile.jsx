import React, { useState, useEffect, useRef } from "react";
import AuthService from "../../../services/auth";
import { Mail, Phone, MapPin, Calendar, CheckCircle2, ArrowRight, Camera, Share2, Loader2 } from "lucide-react";
import { toBlob } from "html-to-image";

const MobileStudentProfile = () => {
  const fileInputRef = useRef(null);
  const snapshotRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [profileInfo, setProfileInfo] = useState({
    name: "Anirudh Saksena",
    email: "anirudh@iips.edu",
    course: "Bachelors Computer Applications",
    year: "Semester IV",
    enrollment: "IIPS1234",
    phone: "+91 98765 43210",
    dob: "12 Feb 2004",
    location: "Indore, Madhya Pradesh"
  });

  useEffect(() => {
    AuthService.getMe()
      .then((data) => {
        setProfileInfo(prev => ({
          ...prev,
          name: data.name || prev.name,
          email: data.email || prev.email,
          course: data.course || prev.course,
          year: data.year || prev.year,
          enrollment: data.enrollment || prev.enrollment
        }));
      })
      .catch((err) => console.error(err));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = async () => {
    if (!snapshotRef.current) return;
    setIsSharing(true);
    try {
      const filter = (node) => {
        if (node.dataset && node.dataset.html2canvasIgnore === 'true') {
          return false;
        }
        return true;
      };

      const blob = await toBlob(snapshotRef.current, {
        filter: filter,
        backgroundColor: '#ffffff',
        pixelRatio: 2
      });

      if (!blob) throw new Error("Failed to generate blob");

      const file = new File([blob], 'wellbeing-snapshot.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'My Wellbeing Snapshot',
            text: 'Check out my wellbeing snapshot from Manomitra!',
            files: [file]
          });
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'wellbeing-snapshot.png';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating snapshot:', error);
      alert('Failed to generate snapshot. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-sans">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#386641] font-serif leading-none mb-2">
            Profile
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Manage your profile and track your wellbeing journey
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        {/* Left Column: Avatar & Summary Stats */}
        <div className="w-full shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div
              className="w-32 h-32 rounded-full bg-[#E8F3EB] flex items-center justify-center text-[#2A523D] text-5xl font-serif shadow-inner mb-4 relative cursor-pointer overflow-hidden group"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profileInfo.name.charAt(0)
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <h2 className="text-2xl font-semibold text-[#1E3A2F] font-serif mb-1">{profileInfo.name}</h2>
            <p className="text-sm text-gray-500 font-medium">{profileInfo.course}, {profileInfo.year}</p>
            <p className="text-sm text-gray-500 font-medium mb-8">IIPS, DAVV, Indore</p>

            <div className="w-full text-left mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-[#2A523D]">Profile Completion</span>
                <span className="text-xs font-semibold text-[#2A523D]">85%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#2A523D] h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="flex justify-between w-full border-t border-gray-100 pt-6">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-[#E8F3EB] rounded-xl flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-[#2A523D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <span className="text-lg font-semibold text-[#1E3A2F]">12</span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider text-center">Assessments<br />Completed</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-[#F0EEFF] rounded-xl flex items-center justify-center mb-2">
                  <Calendar className="w-5 h-5 text-[#6B5AED]" />
                </div>
                <span className="text-lg font-semibold text-[#1E3A2F]">8</span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider text-center">Events<br />Joined</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-[#FFF5E5] rounded-xl flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-[#F5A623]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                </div>
                <span className="text-sm font-semibold text-[#1E3A2F] mt-1 text-center leading-tight">Above<br />Average</span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider text-center mt-1">Wellbeing<br />Status</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Content Cards */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col gap-6 overflow-y-auto pb-8 pr-2">
            {/* Top Row: About Me & Snapshot */}
            <div className="flex flex-col gap-6">
              {/* About Me */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1E3A2F] mb-4">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  About Me
                </h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  I'm passionate about building a balanced life and continuously working on my mental and emotional well-being.
                </p>

                <div className="flex flex-col gap-4 mt-auto">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-gray-400 mb-0.5">Date of Birth</div>
                      <div className="text-sm font-medium text-[#1E3A2F]">{profileInfo.dob}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-gray-400 mb-0.5">Email</div>
                      <div className="text-sm font-medium text-[#1E3A2F]">{profileInfo.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-gray-400 mb-0.5">Phone</div>
                      <div className="text-sm font-medium text-[#1E3A2F]">{profileInfo.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-gray-400 mb-0.5">Location</div>
                      <div className="text-sm font-medium text-[#1E3A2F]">{profileInfo.location}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wellbeing Snapshot */}
              <div ref={snapshotRef} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                <h3 className="text-lg font-semibold text-[#1E3A2F] mb-6 relative z-10">
                  My Wellbeing Snapshot
                </h3>

                <div className="flex flex-col md:flex-row gap-6 relative z-10 flex-1 items-center">
                  <div className="flex flex-col items-center justify-center bg-[#F3F9F5] rounded-3xl w-24 h-24 shrink-0">
                    <svg className="w-12 h-12 text-[#3A7654] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 bg-[#F3F9F5] p-1.5 rounded-lg text-[#3A7654]">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#1E3A2F]">Self-aware</div>
                        <div className="text-xs text-gray-500">You understand your strengths</div>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 bg-[#F3F9F5] p-1.5 rounded-lg text-[#3A7654]">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#1E3A2F]">Resilient</div>
                        <div className="text-xs text-gray-500">You handle challenges well</div>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 bg-[#F3F9F5] p-1.5 rounded-lg text-[#3A7654]">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#1E3A2F]">Growing</div>
                        <div className="text-xs text-gray-500">Keep focusing on consistency</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6 flex justify-between items-end relative z-10">
                  <div>
                    <h4 className="text-xl font-semibold text-[#1E3A2F] font-serif">Above Average</h4>
                    <p className="text-xs text-gray-500 font-medium">You're doing great!</p>
                  </div>
                  <button 
                    onClick={handleShare}
                    disabled={isSharing}
                    data-html2canvas-ignore="true"
                    className="flex items-center gap-2 text-sm font-semibold text-[#3A7654] border border-[#3A7654] px-4 py-2 rounded-xl hover:bg-[#3A7654] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSharing ? (
                      <>Generating... <Loader2 className="w-4 h-4 animate-spin" /></>
                    ) : (
                      <>Share <Share2 className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Journey Timeline */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1E3A2F] mb-1">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                Wellbeing Journey
              </h3>
              <p className="text-sm text-gray-500 mb-10">Your assessment history</p>

              <div className="relative mx-4 mb-4">
                {/* Connecting Line */}
                <div className="absolute top-3 left-2 right-2 h-0.5 bg-gray-200">
                  <div className="absolute top-0 left-0 h-full bg-[#3A7654]" style={{ width: '75%' }}></div>
                </div>

                {/* Timeline Points */}
                <div className="relative flex justify-between overflow-x-auto pb-4 gap-4 hide-scrollbar">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#3A7654] text-white flex items-center justify-center z-10 mb-3 shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-semibold text-[#1E3A2F]">SCQ-S</div>
                    <div className="text-xs text-gray-500">Self Concept</div>
                    <div className="mt-2 bg-[#F3F9F5] text-[#3A7654] text-[10px] font-semibold px-2 py-1 rounded">12 Jun 2026</div>
                  </div>

                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#3A7654] text-white flex items-center justify-center z-10 mb-3 shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-semibold text-[#1E3A2F]">GWBS</div>
                    <div className="text-xs text-gray-500">General Well-Being</div>
                    <div className="mt-2 bg-[#F3F9F5] text-[#3A7654] text-[10px] font-semibold px-2 py-1 rounded">15 Jun 2026</div>
                  </div>

                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#3A7654] text-white flex items-center justify-center z-10 mb-3 shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-semibold text-[#1E3A2F]">EI</div>
                    <div className="text-xs text-gray-500">Emotional Intelligence</div>
                    <div className="mt-2 bg-[#F3F9F5] text-[#3A7654] text-[10px] font-semibold px-2 py-1 rounded">18 Jun 2026</div>
                  </div>

                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 z-10 mb-3"></div>
                    <div className="text-sm font-semibold text-gray-400">TABBPS</div>
                    <div className="text-xs text-gray-400">Type A/B Pattern</div>
                    <div className="mt-2 bg-[#FFF5E5] text-[#F5A623] text-[10px] font-semibold px-2 py-1 rounded">Upcoming</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileStudentProfile;
