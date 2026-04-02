import OpenAI from "openai";

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

    if (!process.env.GROQ_API_KEY) {
      return Response.json({ success: false, error: "Groq API key not configured." }, { status: 500 });
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const history = messages.map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content || "No response received.";
    return Response.json({ success: true, response: { role: "assistant", content: text } });
  } catch (err) {
    console.error("Chat API error:", err?.message || err);
    return Response.json(
      { success: false, error: err?.message || "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}
