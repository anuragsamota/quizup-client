// src/utils/quizManageApi.js
// Utility functions for quiz-manage service

// Set this to your deployed quiz-manage service URL
export const QUIZ_MANAGE_API_BASE = import.meta.env.VITE_QUIZ_MANAGE_API_BASE || "http://localhost:8080";

export async function createQuiz({ title, questions }) {
  const res = await fetch(`${QUIZ_MANAGE_API_BASE}/api/quiz/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, questions }),
    mode: "cors",
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to create quiz");
  return res.json();
}

// Create a question for a quiz
export async function createQuestion(quizId, question) {
  const res = await fetch(`${QUIZ_MANAGE_API_BASE}/api/quiz/${quizId}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
    mode: "cors",
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to create question");
  return res.json();
}

// Update a question for a quiz
export async function updateQuestion(quizId, questionId, question) {
  const res = await fetch(`${QUIZ_MANAGE_API_BASE}/api/quiz/${quizId}/questions/${questionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
    mode: "cors",
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to update question");
  return res.json();
}

// Delete a question from a quiz
export async function deleteQuestion(quizId, questionId) {
  const res = await fetch(`${QUIZ_MANAGE_API_BASE}/api/quiz/${quizId}/questions/${questionId}`, {
    method: "DELETE",
    mode: "cors",
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to delete question");
  return res.json();
}

// Update quiz (e.g., title or questions order)
export async function updateQuiz(quizId, data) {
  const res = await fetch(`${QUIZ_MANAGE_API_BASE}/api/quiz/${quizId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    mode: "cors",
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to update quiz");
  return res.json();
}
