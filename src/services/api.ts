const API = "http://localhost:5000/api";

export const api = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });

  return res.json();
};
