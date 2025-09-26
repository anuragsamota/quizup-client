// quizup-client/src/utils/quizRuntimeApi.js
import axios from "axios";

const BASE = import.meta.env.VITE_QUIZ_RUNTIME_API_BASE || "http://localhost:5642";

// Create a runtime session (teacher starts quiz)
export async function createSession(sessionId, quizId) {
  const res = await axios.post(`${BASE}/api/session`, { sessionId, quizId });
  return res.data;
}

// Student joins a session (must provide name & roll)
export async function joinSession(sessionId, userId, name, roll) {
  const res = await axios.post(`${BASE}/api/session/join`, { sessionId, userId, name, roll });
  return res.data;
}

// Student leaves
export async function leaveSession(sessionId, userId) {
  const res = await axios.post(`${BASE}/api/session/leave`, { sessionId, userId });
  return res.data;
}

// Student submits an answer (server route is /api/session/answer)
export async function submitAnswer(sessionId, userId, answer) {
  const res = await axios.post(`${BASE}/api/session/answer`, { sessionId, userId, answer });
  return res.data;
}

// Get session info including populated questions and submissions
export async function getSession(sessionId) {
  const res = await axios.get(`${BASE}/api/session/${sessionId}`);
  return res.data;
}

// Get results (teacher view)
export async function getResults(sessionId) {
  const res = await axios.get(`${BASE}/api/session/${sessionId}/results`);
  return res.data;
}


// End session
export async function endSession(sessionId) {
  const res = await axios.delete(`${BASE}/api/session/${sessionId}`);
  return res.data;
}
