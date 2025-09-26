// src/utils/quizManageApi.js
// Utility functions for quiz-manage service


import axios from "axios";
// Set this to your deployed quiz-manage service URL
export const QUIZ_MANAGE_API_BASE = import.meta.env.VITE_QUIZ_MANAGE_API_BASE || "http://localhost:8080";

export async function createQuiz({ title, questions }) {
  try {
    const res = await axios.post(`${QUIZ_MANAGE_API_BASE}/api/quiz/`, { title, questions });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create quiz");
  }
}

// Create a question for a quiz
export async function createQuestion(quizId, question) {
  try {
    const res = await axios.post(`${QUIZ_MANAGE_API_BASE}/api/quiz/${quizId}/questions`, question);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create question");
  }
}

// Update a question for a quiz
export async function updateQuestion(quizId, questionId, question) {
  try {
    const res = await axios.put(`${QUIZ_MANAGE_API_BASE}/api/quiz/${quizId}/questions/${questionId}`, question);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update question");
  }
}

// Delete a question from a quiz
export async function deleteQuestion(quizId, questionId) {
  try {
    const res = await axios.delete(`${QUIZ_MANAGE_API_BASE}/api/quiz/${quizId}/questions/${questionId}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete question");
  }
}

// Update quiz (e.g., title or questions order)
export async function updateQuiz(quizId, data) {
  try {
    const res = await axios.put(`${QUIZ_MANAGE_API_BASE}/api/quiz/${quizId}`, data);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update quiz");
  }
}
