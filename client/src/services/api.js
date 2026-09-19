import axios from "axios";

// Base URL of the Express backend. In development, Vite runs on
// http://localhost:5173 and the API on http://localhost:5000.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Normalizes errors from axios (network failure, timeout, or a JSON
// error body from our backend) into a single readable message string.
function extractErrorMessage(error) {
  if (error.response) {
    // Backend responded with an error status code
    return (
      error.response.data?.error ||
      `Request failed with status ${error.response.status}.`
    );
  }
  if (error.request) {
  
    return "Could not reach the server. Please check your connection and that the backend is running.";
  }
  return error.message || "An unexpected error occurred.";
}

export async function fetchVoices() {
  try {
    const { data } = await apiClient.get("/api/voices");
    return data; // { languages, voices }
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function generateSpeech({ text, language, voice }) {
  try {
    const { data } = await apiClient.post("/api/tts", {
      text,
      language,
      voice,
    });
    return data; // { success, audioUrl }
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export { API_BASE_URL };