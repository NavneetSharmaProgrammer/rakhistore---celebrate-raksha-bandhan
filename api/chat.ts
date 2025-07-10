// File: api/chat.ts
// This is the complete and correct version.

import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

export const config = {
  runtime: 'edge',
};

// This section correctly initializes the AI client.
// It does NOT import from a non-existent '../lib/ai' file.
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("SERVER ERROR: GOOGLE_GEMINI_API_KEY environment variable not set.");
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

// This is the function that Vercel runs
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { history, message } = await req.json();

    const chat = ai.chats.create({
      model: 'gemini-1.5-flash',
      history: history,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const result = await chat.sendMessageStream({ message: message });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result) {
          // Access .text as a property and check if it exists
          const chunkText = chunk.text;
          if (chunkText) {
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('Error in chat handler:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}