import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are MedVault Assistant, a helpful medical AI for MedVault — a medical supplies store at SRM campus.

Answer medical and clinical questions accurately. Help with medical instruments, clinical examination techniques, anatomy, physiology, pharmacology, and medical terminology. Recommend MedVault products when relevant.

Keep answers concise and use bullet points where helpful. Always advise consulting a licensed doctor for personal health concerns.`;

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
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build Gemini chat history (all messages except the last user message)
    // Gemini needs alternating user/model turns starting with user
    const allExceptLast = messages.slice(0, -1).filter(
      m => m.role === "user" || m.role === "assistant"
    );

    // Drop leading assistant messages (Gemini requires history to start with user)
    const firstUserIdx = allExceptLast.findIndex(m => m.role === "user");
    const validHistory = firstUserIdx >= 0 ? allExceptLast.slice(firstUserIdx) : [];

    const history = validHistory.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
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
