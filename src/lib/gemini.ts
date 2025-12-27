import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(API_KEY || "dummy-key");

export interface TransportRoute {
    busNumbers: string[];
    frequency: string;
    steps: string[];
    estimatedTime: string;
}

export const getPublicTransportRoute = async (destination: string): Promise<TransportRoute> => {
    if (!API_KEY) {
        console.warn("Missing VITE_GEMINI_API_KEY. Using mock data.");
        // Return mock data if API key is missing to prevent crash
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    busNumbers: ["225L", "225D", "10K"],
                    frequency: "Every 15-20 mins",
                    steps: [
                        "Walk to Main Gate Bus Stop (5 mins).",
                        "Board Bus 225L towards JNTU.",
                        "Get down at JNTU Metro Station.",
                        `Take Metro or Bus to ${destination}.`
                    ],
                    estimatedTime: "45-60 mins"
                });
            }, 1500);
        });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `I am at KLH University Bowrampet. I need to go to ${destination} using public transport (RTC bus/Metro). 
    Provide a structured travel plan.
    Return STRICTLY a JSON object with this schema:
    {
      "busNumbers": ["list", "of", "bus/metro", "numbers"],
      "frequency": "estimated frequency string",
      "steps": ["step 1", "step 2", "detailed instructions"],
      "estimatedTime": "estimated duration string"
    }
    Do not add markdown formatting or backticks. Just the JSON string.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up if model returns markdown code blocks
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText) as TransportRoute;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to fetch route info. Please try again.");
    }
};
