// src/utils/authApi.js
// Utility functions for user authentication API

const API_BASE = "https://quizup-user-manage-service.vercel.app";

export async function loginUser({ username, password }) {
  console.log(username, password);
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Add this line
        "Accept": "application/json",
    },
    body: JSON.stringify({ username, password }),
    mode: "cors",
  });
  console.log(res);
  if (!res.ok) throw new Error((await res.json()).message || "Login failed");
  return res.json(); // should return { token, user }
}

export async function registerUser({username, name, email, password }) {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, name, email, password }),
    mode: "cors",
  });
  if (!res.ok)
    throw new Error((await res.json()).message || "Registration failed");
  return res.json(); // should return { token, user }
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
