import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

// POST /api/contact
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body || {};

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Fetch recipient email from database
    let dbRecipientEmail = null;
    try {
      const contactPage = await prisma.page.findUnique({
        where: { slug: "contact" },
        include: { sections: true }
      });

      if (contactPage && contactPage.sections) {
        const contactSection = contactPage.sections.find(s => s.type === "contact");
        if (contactSection && contactSection.content && contactSection.content.recipientEmail) {
          dbRecipientEmail = contactSection.content.recipientEmail;
        }
      }
    } catch (dbErr) {
      console.error("Error fetching recipient email from DB:", dbErr);
    }

    // Use env vars for SMTP credentials. Update .env.local accordingly.
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;
    const EMAIL_TO = dbRecipientEmail || process.env.CONTACT_EMAIL || "natretroian@gmail.com";

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.error("SMTP credentials are not configured.");
      return new Response(
        JSON.stringify({ error: "Mail server not configured. Please set SMTP_* env vars." }),
        { status: 501 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `${name} <${EMAIL_FROM}>`,
      to: EMAIL_TO,
      subject: `Contact form submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone || "-"}</p>
             <hr />
             <p>${message.replace(/\n/g, "<br />")}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Error sending contact email:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to send email" }), { status: 500 });
  }
}
