import { toast } from 'sonner';
import { GET_STATIC_ROUTE } from './hydBusData';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export interface TransportRoute {
    busNumbers: string[];
    frequency: string;
    steps: string[];
    estimatedTime: string;
}

export const getOpenAIRoute = async (destination: string): Promise<TransportRoute> => {
    // 1. Try Local Static Data First (Instant & Free)
    // We keep this because it's faster and guaranteed correct for known hubs
    const staticMatch = GET_STATIC_ROUTE(destination);
    if (staticMatch) {
        return new Promise((resolve) => setTimeout(() => resolve(staticMatch), 600));
    }

    // 2. Check for API Key
    if (!API_KEY) {
        console.warn("OpenAI API Key missing.");
        toast.error("OpenAI API Key is missing in .env");
        throw new Error("Missing OpenAI API Key");
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // or gpt-4 if available
                messages: [
                    {
                        role: "system",
                        content: `You are an expert on Hyderabad TSRTC bus routes. 
                        Response MUST be valid JSON with this schema:
                        {
                            "busNumbers": ["string"],
                            "frequency": "string",
                            "steps": ["string"],
                            "estimatedTime": "string"
                        }
                        Do not include markdown formatting (like \`\`\`json). Just return the raw JSON.`
                    },
                    {
                        role: "user",
                        content: `I am at KLH University, Bowrampet. I need to go to ${destination}. Suggest RTC bus route.`
                    }
                ],
                temperature: 0.2
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || "OpenAI API request failed");
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        let cleanText = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText) as TransportRoute;

    } catch (error: any) {
        console.error("OpenAI Error:", error);
        toast.error(`OpenAI Failed: ${error.message}`);

        // Return a fallback so the UI doesn't crash, but it will be generic
        return {
            busNumbers: ["RTC"],
            frequency: "Unknown",
            estimatedTime: "Unknown",
            steps: ["Could not fetch route from AI. Please check the API Key."]
        };
    }
};
