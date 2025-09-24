// src/utils/userApi.js
// Utility functions for user profile and user data

const USER_API_BASE = "https://quizup-user-manage-service.vercel.app";

export async function fetchUserProfile(token) {
  const res = await fetch(`${USER_API_BASE}/api/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    mode: "cors",
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch user profile");
  return res.json();
}

export async function fetchUserHistory(token) {
  const res = await fetch(`${USER_API_BASE}/api/history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    mode: "cors",
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch quiz history");
  return res.json();
}

export async function fetchOrganizedQuizzes(token) {
  const res = await fetch(`${USER_API_BASE}/api/organized`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    mode: "cors",
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch organized quizzes");
  return res.json();
}

export async function updateUserProfile(token, { name, email }) {
  const res = await fetch(`${USER_API_BASE}/api/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ name, email }),
    mode: "cors",
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to update profile");
  return res.json();
}

export async function deleteUserAccount(token) {
  const res = await fetch(`${USER_API_BASE}/api/profile`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    mode: "cors",
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to delete account");
  return res.json();
}
