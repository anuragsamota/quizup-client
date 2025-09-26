// src/utils/quizRuntimeApi.js
// Utility functions for quiz-runtime service REST API
// Set this to your deployed quiz-runtime service URL
import axios from "axios";

export const QUIZ_RUNTIME_API_BASE = import.meta.env.VITE_QUIZ_RUNTIME_API_BASE || "http://localhost:5642";

// 1. Create a new quiz session
export async function createQuizSession({ sessionId, quizId }) {
  const res = await axios.post(`${QUIZ_RUNTIME_API_BASE}/api/session`, { sessionId, quizId });
  return res.data;
}

// 2. Join a quiz session
export async function joinQuizSession({ sessionId, userId }) {
  const res = await axios.post(`${QUIZ_RUNTIME_API_BASE}/api/session/join`, { sessionId, userId });
  return res.data;
}

// 3. Leave a quiz session
export async function leaveQuizSession({ sessionId, userId }) {
  const res = await axios.post(`${QUIZ_RUNTIME_API_BASE}/api/session/leave`, { sessionId, userId });
  return res.data;
}

// 4. Submit an answer
export async function submitQuizAnswer({ sessionId, userId, answer }) {
  const res = await axios.post(`${QUIZ_RUNTIME_API_BASE}/api/session/answer`, { sessionId, userId, answer });
  return res.data;
}

// 5. Get session info
export async function getQuizSession(sessionId) {
  const res = await axios.get(`${QUIZ_RUNTIME_API_BASE}/api/session/${sessionId}`);
  return res.data;
}

// 6. End a session
export async function endQuizSession(sessionId) {
  const res = await axios.delete(`${QUIZ_RUNTIME_API_BASE}/api/session/${sessionId}`);
  return res.data;
}
