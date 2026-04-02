export async function GET() {
  return Response.json({ success: true, message: "Chat API is available" });
}

export async function POST(request) {
  const body = await request.json();
  const messages = body?.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      { success: false, error: "Please send a messages array in the request body." },
      { status: 400 }
    );
  }

  const lastMessage = messages[messages.length - 1];
  const userText = typeof lastMessage.content === "string" ? lastMessage.content : "";

  const reply = userText
    ? `You wrote: ${userText}`
    : "Hi there! Send a message with { messages: [{ role: 'user', content: '...' }] } to get started.";

  return Response.json({
    success: true,
    response: {
      role: "assistant",
      content: reply,
    },
  });
}
