import OpenAI from "openai";

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
        { success: false, error: "Please send a messages array in the request body." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ success: false, error: "OpenAI API key not configured." }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const conversation = messages.map(({ role, content }) => ({ role, content }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...conversation],
      max_tokens: 600,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message;

    return Response.json({ success: true, response: { role: reply.role, content: reply.content } });
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json(
      { success: false, error: err?.message || "Failed to get response from AI." },
      { status: 500 }
    );
  }
}
