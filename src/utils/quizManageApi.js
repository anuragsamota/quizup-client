// quizup-client/src/utils/quizManageApi.js
import axios from "axios";

export const QUIZ_MANAGE_API_BASE = import.meta.env.VITE_QUIZ_MANAGE_API_BASE || "http://localhost:8080";

export async function createQuiz({ title, questions, organizer }) {
  const payload = { 
    title, 
    description: '', 
    questions: questions || [] 
  };
  
  // Add organizer if provided
  if (organizer) {
    payload.organizer = organizer;
  }
  
  const res = await axios.post(`${QUIZ_MANAGE_API_BASE}/api/quiz/`, payload);
  return res.data;
}

export async function getAllQuizzes() {
  const res = await axios.get(`${QUIZ_MANAGE_API_BASE}/api/quiz/`);
  return res.data;
}

export async function getQuizById(quizId) {
  const res = await axios.get(`${QUIZ_MANAGE_API_BASE}/api/quiz/${quizId}`);
  return res.data;
}

export async function getQuizzesByOrganizer(username) {
  const res = await axios.get(`${QUIZ_MANAGE_API_BASE}/api/quiz/organizer/${username}`);
  return res.data;
}

export async function createQuestion(quizId, payload) {
  return (await axios.post(`${QUIZ_MANAGE_API_BASE}/api/quiz/${quizId}/questions`, payload)).data;
}

export async function updateQuestion(quizId, qid, payload) {
  return (await axios.put(`${QUIZ_MANAGE_API_BASE}/api/quiz/${quizId}/questions/${qid}`, payload)).data;
}

export async function deleteQuestion(quizId, qid) {
  return (await axios.delete(`${QUIZ_MANAGE_API_BASE}/api/quiz/${quizId}/questions/${qid}`)).data;
}


export async function updateQuiz(quizId, payload) {
  const res = await axios.put(`${QUIZ_MANAGE_API_BASE}/api/quiz/${quizId}`, payload);
  return res.data;
}
