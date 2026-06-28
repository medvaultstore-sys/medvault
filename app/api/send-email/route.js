import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { order } = await request.json();

  const itemsRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #1a3333;color:#e0f0ea;">${item.name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1a3333;color:#e0f0ea;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1a3333;color:#1DBF73;text-align:right;font-weight:700;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
        </tr>`
    )
    .join("");

  const customerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0D1F1F;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#0D1F1F;border:1px solid #1a3333;border-radius:16px;overflow:hidden;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0F5C4D,#0D1F1F);padding:40px 40px 32px;text-align:center;border-bottom:1px solid #1a3333;">
      <div style="display:inline-block;background:linear-gradient(135deg,#1DBF73,#0F5C4D);border-radius:10px;padding:10px 18px;margin-bottom:16px;">
        <span style="font-weight:900;font-size:18px;color:#fff;letter-spacing:-1px;">MV+</span>
      </div>
      <h1 style="margin:0;font-size:28px;font-weight:900;color:#fff;letter-spacing:3px;text-transform:uppercase;">MEDVAULT</h1>
      <p style="margin:8px 0 0;color:#47D89B;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Order Confirmed</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <p style="color:#a0c4b8;font-size:15px;margin:0 0 8px;">Hello, <strong style="color:#fff;">${order.customerName}</strong></p>
      <p style="color:#a0c4b8;font-size:14px;margin:0 0 28px;line-height:1.6;">
        Your order has been placed successfully. We'll process and ship it soon. Here are your order details:
      </p>

      <!-- Order ID badge -->
      <div style="background:#0a1a1a;border:1px solid #1DBF73;border-radius:10px;padding:16px 20px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;">
        <span style="color:#a0c4b8;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Order ID</span>
        <span style="color:#1DBF73;font-weight:800;font-size:16px;letter-spacing:1px;">${order.orderId}</span>
      </div>

      <!-- Items table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#0a1a1a;">
            <th style="padding:10px 12px;text-align:left;color:#47D89B;font-size:11px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #1a3333;">Item</th>
            <th style="padding:10px 12px;text-align:center;color:#47D89B;font-size:11px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #1a3333;">Qty</th>
            <th style="padding:10px 12px;text-align:right;color:#47D89B;font-size:11px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #1a3333;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsRows}</tbody>
      </table>

      <!-- Total -->
      <div style="background:#0a1a1a;border-radius:10px;padding:16px 20px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;">
        <span style="color:#a0c4b8;font-size:14px;font-weight:600;">Total</span>
        <span style="color:#1DBF73;font-size:22px;font-weight:900;">₹${order.total.toLocaleString("en-IN")}</span>
      </div>

      <!-- Delivery address -->
      <div style="background:#0a1a1a;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0 0 6px;color:#47D89B;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Delivery Address</p>
        <p style="margin:0;color:#e0f0ea;font-size:14px;line-height:1.6;">${order.address}</p>
      </div>

      <p style="color:#a0c4b8;font-size:13px;line-height:1.6;margin:0;">
        If you have any questions, reply to this email or reach us at <a href="mailto:medvaultstore@gmail.com" style="color:#1DBF73;text-decoration:none;">medvaultstore@gmail.com</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#0a1a1a;padding:20px 40px;text-align:center;border-top:1px solid #1a3333;">
      <p style="margin:0;color:#3a6060;font-size:12px;">© ${new Date().getFullYear()} MedVault. Premium Medical Essentials.</p>
    </div>
  </div>
</body>
</html>`;

  const adminText = `
New Order Received — MedVault

Order ID: ${order.orderId}
Customer: ${order.customerName}
Email: ${order.email}
Phone: ${order.phone || "N/A"}
Address: ${order.address}

Items:
${order.items.map((i) => `  - ${i.name} x${i.quantity} = ₹${(i.price * i.quantity).toLocaleString("en-IN")}`).join("\n")}

Total: ₹${order.total.toLocaleString("en-IN")}
`;

  try {
    await Promise.all([
      resend.emails.send({
        from: "MedVault <onboarding@resend.dev>",
        to: order.email,
        subject: `Order Confirmed — ${order.orderId} | MedVault`,
        html: customerHtml,
      }),
      resend.emails.send({
        from: "MedVault <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL,
        subject: `New Order: ${order.orderId} — ${order.customerName}`,
        text: adminText,
      }),
    ]);
    return Response.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}