import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Gemini API
// Use dummy key if missing to avoid immediate instantiation error, 
// though we handle empty key check below.
const genAI = new GoogleGenerativeAI(API_KEY || "dummy-key");

export interface TransportRoute {
    busNumbers: string[];
    frequency: string;
    steps: string[];
    estimatedTime: string;
}

const MOCK_ROUTE: TransportRoute = {
    busNumbers: ["225L", "290U", "Metro Red"],
    frequency: "Every 15-20 mins",
    steps: [
        "Walk to Main Gate Bus Stop (5 mins).",
        "Board Bus 225L towards JNTU / Miyapur.",
        "Get down at JNTU Metro Station.",
        "Take Metro or Bus to your destination."
    ],
    estimatedTime: "45-60 mins"
};

import { GET_STATIC_ROUTE } from "./hydBusData";

import { toast } from 'sonner';

export const getPublicTransportRoute = async (destination: string): Promise<TransportRoute> => {
    // 1. Check for API Key FIRST
    if (API_KEY) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `
            I am at KLH University, Bowrampet (Hyderabad). I need to go to ${destination} using public transport (RTC bus).
            
            You are an expert on Hyderabad TSRTC bus routes and timings. Use accurate knowledge from datasets like 'hyd-bus-data' to suggest real, existing bus numbers (e.g., 222A, 219, 29B) and routes.
            
            Provide a JSON response with:
            - busNumbers: Array of string (e.g. ["219", "222A"])
            - estimatedTime: String (e.g. "45 mins")
            - steps: Array of strings describing the route (walk to stop, take bus X, get down at Y).
            
            Return ONLY valid JSON.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

            if (!cleanText) {
                throw new Error("Empty response from AI");
            }

            return JSON.parse(cleanText) as TransportRoute;

        } catch (error: any) {
            console.error("Gemini API Error:", error);
            // CRITICAL: Tell the user WHY it failed instead of showing fake data
            toast.error(`AI Search Failed: ${error.message || "Unknown error"}. Showing estimated data instead.`);
            // Fall through to static check below
        }
    } else {
        console.warn("No API Key found. Skipping AI generation.");
    }

    // 2. Fallback to Local Static Data (GitHub Repo Data)
    const staticMatch = GET_STATIC_ROUTE(destination);
    if (staticMatch) {
        return new Promise((resolve) => setTimeout(() => resolve(staticMatch), 600));
    }

    // 3. Final Fallback (Generic Mock) - ONLY if static missing and AI failed
    // We update this mock to be less specific so it doesn't look like a wrong answer for "Wonderla"
    return {
        busNumbers: ["219", "SPL"],
        frequency: "Every 30 mins",
        estimatedTime: "1 hr + (Est)",
        steps: [
            "Route data unavailable for this specific location.",
            "Take Bus 219 to Patancheru / Secunderabad.",
            "Ask local conductor for connecting bus to " + destination
        ]
    };
};
