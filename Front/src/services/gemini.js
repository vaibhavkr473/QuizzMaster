import { GoogleGenerativeAI } from "@google/generative-ai";

const VITE_GEMINI_API_KEY = "AIzaSyD7SKbxLIKknJ0chFjkgbPFkum9LgVCzjM";
export const genAI = new GoogleGenerativeAI(VITE_GEMINI_API_KEY);