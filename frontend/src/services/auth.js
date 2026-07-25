import API from "./api";

const AuthService = {
  login: async (email, password) => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const response = await API.post("/auth/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, role } = response.data;

    localStorage.setItem("token", access_token);
    localStorage.setItem("role", role);

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },

  getMe: async () => {
    const response = await API.get("/auth/me");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await API.patch("/auth/me", profileData);
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await API.get("/admin/dashboard");
    return response.data;
  },

  getAdminEvents: async () => {
    const response = await API.get("/admin/events");
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await API.post("/admin/events", eventData);
    return response.data;
  },

  getEventQuizzes: async (eventId) => {
    const response = await API.get(`/admin/events/${eventId}/quizzes`);
    return response.data;
  },

  getEventResults: async (eventId) => {
    const response = await API.get(`/admin/events/${eventId}/results`);
    return response.data;
  },

  // EI has its own endpoint because results are competency-based
  getEIResults: async (eventId) => {
    const response = await API.get(`/admin/events/${eventId}/results/ei`);
    return response.data;
  }
};

export default AuthService;