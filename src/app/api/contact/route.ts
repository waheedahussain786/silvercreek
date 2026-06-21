import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();
  if (!name || !email || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const to = process.env.NOTIFICATION_EMAIL;
  if (!to || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Silver Creek Boutique <noreply@silvercreekboutique.com>",
    to,
    subject: `New message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, "<br>")}</p>`,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
