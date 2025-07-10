import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { PRODUCTS } from '../constants';

// This is the production-safe way to get your API key.
// It will read the 'GOOGLE_GEMINI_API_KEY' variable you set in Vercel.
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
    // This will cause the Vercel function to fail with a clear error
    // if the environment variable is not set.
    throw new Error("GOOGLE_GEMINI_API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

const productListForAI = PRODUCTS.map(p => `- ${p.name} (ID: ${p.id})`).join('\n');

const systemInstruction = `You are the "Rakhi Assistant", a friendly and helpful AI shopping assistant for the "RakhiStore" e-commerce website. Your goal is to help users find the perfect Rakhi for their siblings with warmth and care.

Your personality:
- Knowledgeable about Rakhi traditions and modern trends.
- Empathetic, kind, and engaging.
- You understand the emotional importance of the festival.
- Keep responses concise, friendly, and helpful.

Your capabilities:
- You can recommend products from the store.
- You can answer questions about the festival of Raksha Bandhan.
- You can help users figure out what kind of Rakhi they're looking for.

Available products:
Here is the list of available Rakhis. Only recommend products from this list. Mention them by name.
${productListForAI}

Instructions:
1. Start the conversation by introducing yourself and asking how you can help celebrate Raksha Bandhan.
2. When a user asks for a recommendation, ask clarifying questions (e.g., "Who is the Rakhi for?", "What's their style? Traditional, modern, or maybe for a child?").
3. Based on their answers, suggest one or two specific Rakhis from the list. Explain WHY you are recommending them.
4. Do not make up products or features. Stick to the information provided.
5. Do not output JSON or markdown. Respond in plain, friendly text.
`;

// Use the 'Chat' type, which IS exported from the module.
export const startChatSession = (): Chat => {
    return ai.chats.create({
        model: 'gemini-1.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
};

// Use the 'Chat' type for the parameter.
export const streamMessage = (chat: Chat, message: string): Promise<AsyncGenerator<GenerateContentResponse>> => {
    // The 'sendMessageStream' method on the 'Chat' object correctly
    // expects an object with a 'message' property.
    return chat.sendMessageStream({ message });
};