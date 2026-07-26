import API from "./api";

const StudentService = {
  // Events
  getEvents: async (status = null) => {
    const params = status ? { status } : {};
    const response = await API.get("/student/events", { params });
    return response.data;
  },

  rsvpEvent: async (eventId) => {
    const response = await API.post("/student/rsvp", { event_id: eventId });
    return response.data;
  },

  getMyRsvps: async () => {
    const response = await API.get("/student/rsvps");
    return response.data;
  },

  // Dashboard
  getStudentDashboard: async () => {
    const response = await API.get("/student/dashboard");
    return response.data;
  },

  // Results
  getMyResults: async () => {
    const response = await API.get("/student/results");
    return response.data;
  },

  getEventQuizzesForStudent: async (eventId) => {
    const response = await API.get(`/student/events/${eventId}/quizzes`);
    return response.data;
  },

  getEventOverall: async (eventId) => {
    const response = await API.get(`/student/events/${eventId}/overall`);
    return response.data;
  },

  // Quiz taking
  getQuizQuestions: async (eventId) => {
    const response = await API.get(`/quiz/event/${eventId}`);
    return response.data;
  },

  submitQuiz: async (quizTemplateId, answers) => {
    const response = await API.post("/quiz/submit", {
      quiz_template_id: quizTemplateId,
      answers,
    });
    return response.data;
  },

  getQuizAttemptResult: async (attemptId) => {
    const response = await API.get(`/quiz/${attemptId}/result`);
    return response.data;
  },
};

export default StudentService;