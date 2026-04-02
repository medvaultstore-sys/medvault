import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are MedVault Assistant, a knowledgeable and friendly medical AI assistant for MedVault — a medical supplies store serving healthcare students and professionals at SRM campus.

Answer medical and clinical questions clearly and accurately. Help users understand medical instruments (stethoscopes, BP apparatus, reflex hammers, etc.), clinical examination techniques, medical terminology, anatomy, physiology, and pharmacology. Recommend MedVault products when relevant.

Always remind users to consult a licensed doctor for personal health concerns. Be concise, use bullet points where helpful, and be encouraging to medical students.`;

export async function GET() {
  return Response.json({ success: true, message: "MedVault Chat API is available" });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const messages = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ success: false, error: "No messages provided." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ success: false, error: "Gemini API key not configured." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build a single prompt with full conversation context
    const conversationText = messages
      .filter(m => m.role === "user" || m.role === "assistant")
      .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const fullPrompt = `${SYSTEM_PROMPT}\n\nConversation so far:\n${conversationText}\n\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    return Response.json({ success: true, response: { role: "assistant", content: text } });
  } catch (err) {
    console.error("Chat API error:", err?.message || err);
    return Response.json(
      { success: false, error: err?.message || "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}
