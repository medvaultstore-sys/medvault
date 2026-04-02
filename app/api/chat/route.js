import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are MedVault Assistant, a knowledgeable and friendly medical AI assistant for MedVault — a medical supplies store serving healthcare students and professionals at SRM campus.

Your role:
- Answer medical and clinical questions clearly and accurately
- Help users understand medical instruments (stethoscopes, BP apparatus, reflex hammers, etc.)
- Guide students on clinical examination techniques and procedures
- Explain medical terminology in simple terms
- Help with anatomy, physiology, pharmacology, and clinical skills questions
- Recommend appropriate MedVault products when relevant (pouches, kits, instruments)

Important guidelines:
- Always remind users to consult a licensed doctor for personal health concerns or diagnosis
- Be concise but thorough — students need practical, exam-ready answers
- Use bullet points for lists and steps to make answers easy to read
- Be encouraging and supportive toward medical students`;

export async function GET() {
  return Response.json({ success: true, message: "MedVault Chat API is available" });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const messages = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { success: false, error: "Please send a messages array." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ success: false, error: "Gemini API key not configured." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert messages to Gemini format (role: "user" | "model")
    // Skip the initial assistant greeting for history
    const history = messages
      .slice(0, -1) // all but the last message
      .filter(m => !(m.role === "assistant" && messages.indexOf(m) === 0)) // skip initial greeting
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return Response.json({ success: true, response: { role: "assistant", content: text } });
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json(
      { success: false, error: err?.message || "Failed to get response from AI." },
      { status: 500 }
    );
  }
}
