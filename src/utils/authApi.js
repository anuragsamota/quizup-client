// src/utils/authApi.js
// Utility functions for user authentication API

import axios from "axios";

// const API_BASE = import.meta.env.USER_API || "http://localhost:8080";
const API_BASE = "https://quizup-user-manage-service.vercel.app";

export async function loginUser({ username, password }) {
  console.log("API_BASE:", API_BASE);
  try {
    const res = await axios.post(`${API_BASE}/api/login`, {
      username,
      password
    }, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    return res.data; // should return { token, user }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

export async function registerUser({ username, name, email, password }) {
  try {
    const res = await axios.post(`${API_BASE}/api/register`, {
      username,
      name,
      email,
      password
    }, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    return res.data; // should return { token, user }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
}

export function storeToken(token) {
  localStorage.setItem("quizup_jwt", token);
}

export function getToken() {
  return localStorage.getItem("quizup_jwt");
}

export function removeToken() {
  localStorage.removeItem("quizup_jwt");
}

export function storeUser(user) {
  localStorage.setItem("quizup_user", JSON.stringify(user));
}

export function getUser() {
  const stored = localStorage.getItem("quizup_user");
  if (!stored || stored === "undefined") return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function removeUser() {
  localStorage.removeItem("quizup_user");
}
