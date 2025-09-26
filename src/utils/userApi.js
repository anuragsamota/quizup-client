
import axios from "axios";
// src/utils/userApi.js
// Utility functions for user profile and user data

const USER_API_BASE = "https://quizup-user-manage-service.vercel.app";

export async function fetchUserProfile(token) {
  try {
    const res = await axios.get(`${USER_API_BASE}/api/profile`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch user profile");
  }
}

export async function fetchUserHistory(token) {
  try {
    const res = await axios.get(`${USER_API_BASE}/api/history`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch quiz history");
  }
}

export async function fetchOrganizedQuizzes(token) {
  try {
    const res = await axios.get(`${USER_API_BASE}/api/organized`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch organized quizzes");
  }
}

export async function updateUserProfile(token, { name, email }) {
  try {
    const res = await axios.put(`${USER_API_BASE}/api/profile`, { name, email }, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update profile");
  }
}

export async function deleteUserAccount(token) {
  try {
    const res = await axios.delete(`${USER_API_BASE}/api/profile`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete account");
  }
}
