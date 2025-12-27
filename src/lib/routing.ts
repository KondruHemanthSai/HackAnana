import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from 'sonner';
import { GET_STATIC_ROUTE } from './hydBusData';

// Environment Variables
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface TransportRoute {
    busNumbers: string[];
    frequency: string;
    steps: string[];
    estimatedTime: string;
}

// Internal: Gemini Logic (Restored & Fixed)
// Using 'gemini-pro' which is the stable model for standard API keys
const callGemini = async (destination: string): Promise<TransportRoute> => {
    if (!GEMINI_KEY) throw new Error("Gemini Key missing");

    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    I am at KLH University, Bowrampet (Hyderabad). I need to go to ${destination} using public transport (RTC bus).
    You are an expert on Hyderabad TSRTC bus routes. Provides route info.
    Respond ONLY with valid JSON (no markdown):
    {
        "busNumbers": ["string"],
        "frequency": "string",
        "steps": ["string"],
        "estimatedTime": "string"
    }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as TransportRoute;
};

// Internal: OpenAI Logic
const callOpenAI = async (destination: string): Promise<TransportRoute> => {
    if (!OPENAI_KEY) throw new Error("OpenAI Key missing");

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an expert on Hyderabad bus routes. Return ONLY valid JSON:
                    { "busNumbers": ["string"], "frequency": "string", "steps": ["string"], "estimatedTime": "string" }`
                },
                {
                    role: "user",
                    content: `Route from KLH University Bowrampet to ${destination}`
                }
            ],
            temperature: 0.2
        })
    });

    if (!response.ok) {
        let errMessage = "OpenAI Request Failed";
        try {
            const err = await response.json();
            errMessage = err.error?.message || errMessage;
        } catch (e) {
            // ignore json parse error
        }
        throw new Error(errMessage);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const cleanText = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as TransportRoute;
};

// Simple in-memory cache to reduce API calls
const routeCache = new Map<string, TransportRoute>();

// MAIN EXPORT: Cascading Router
export const getBestRoute = async (destination: string): Promise<TransportRoute> => {
    // 0. Check Cache (Instant & Free)
    const cacheKey = destination.toLowerCase().trim();
    if (routeCache.has(cacheKey)) {
        return routeCache.get(cacheKey)!;
    }

    // 1. Static Data (Fastest, cheapest, 100% reliable)
    const staticMatch = GET_STATIC_ROUTE(destination);
    if (staticMatch) {
        routeCache.set(cacheKey, staticMatch);
        return new Promise((resolve) => setTimeout(() => resolve(staticMatch), 500));
    }

    let result: TransportRoute | null = null;
    let openAIFailed = false;

    // 2. Try OpenAI First
    if (OPENAI_KEY) {
        try {
            result = await callOpenAI(destination);
        } catch (error: any) {
            console.warn("OpenAI Failed (likely quota):", error.message);
            openAIFailed = true;
        }
    }

    // 3. Try Gemini Backup (If OpenAI failed or missing)
    if (!result && GEMINI_KEY) {
        try {
            console.log("Creating backup request to Gemini...");
            result = await callGemini(destination);
            if (openAIFailed) {
                toast.success("Switched to Google Gemini (OpenAI Quota Exceeded)");
            }
        } catch (error: any) {
            console.error("Gemini also failed:", error);
            // Use toast only if NO result at all
            if (!openAIFailed) toast.error(`AI Routing Failed: ${error.message}`);
        }
    }

    // Save to cache if we got a valid result
    if (result) {
        routeCache.set(cacheKey, result);
        return result;
    }

    // 4. Final Fallback (Generic)
    return {
        busNumbers: ["219", "SPL"],
        frequency: "Every 30 mins",
        estimatedTime: "1 hr + (Est)",
        steps: [
            "Could not fetch live AI route (Quota/Network Issues).",
            "Board Bus 219 towards Secunderabad.",
            "Ask local conductor for further connections to " + destination
        ]
    };
};
