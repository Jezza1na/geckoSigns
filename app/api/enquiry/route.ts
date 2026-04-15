// app/api/enquiry/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

// --- In-memory rate limiter (per IP) ---
const rateLimitMap: Record<string, number[]> = {};
const RATE_LIMIT = 2; // requests
const RATE_WINDOW = 10 * 60 * 1000; // 10 minutes

// --- Swear word list (simplified) ---
const bannedWords = ["fuck", "shit", "bitch", "damn", "asshole", "cunt"];

const escapeHtml = (unsafe: string) =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const capitalizeWords = (str: string) =>
  str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

// --- Get recipients from environment variable ---
const recipients = process.env.ENQUIRY_RECIPIENTS?.split(",").map(e => e.trim()) || [];

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // --- Rate limiting ---
    const now = Date.now();
    if (!rateLimitMap[ip]) rateLimitMap[ip] = [];
    rateLimitMap[ip] = rateLimitMap[ip].filter((t) => now - t < RATE_WINDOW);

    if (rateLimitMap[ip].length >= RATE_LIMIT) {
      return NextResponse.json({ error: "Too many requests, please try again later." }, { status: 429 });
    }
    rateLimitMap[ip].push(now);

    const formData = await req.formData();
    let name = (formData.get("name") as string) || "";
    let email = (formData.get("email") as string) || "";
    let phone = (formData.get("phone") as string) || "";
    let date = (formData.get("date") as string) || "";
    let quantity = parseInt((formData.get("quantity") as string) || "1");
    let comments = (formData.get("comments") as string) || "";
    const bannerTypes = formData.getAll("bannerType") as string[];
    const file = formData.get("file") as File | null;

    // --- Validation ---
    if (!name || !email) return NextResponse.json({ error: "Name and Email are required." }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return NextResponse.json({ error: "Invalid email address." }, { status: 400 });

    const phoneRegex = /^[0-9+\s()-]{8,15}$/;
    if (phone && !phoneRegex.test(phone)) return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });

    if (bannerTypes.length === 0) return NextResponse.json({ error: "Select at least one banner type." }, { status: 400 });

    const combinedText = `${name} ${comments}`.toLowerCase();
    if (bannedWords.some(word => combinedText.includes(word))) {
      return NextResponse.json({ error: "Swear words are not allowed." }, { status: 400 });
    }

    if (!date) {
  return NextResponse.json({ error: "Date is required." }, { status: 400 });
}

const submittedDate = new Date(date);

if (isNaN(submittedDate.getTime())) {
  return NextResponse.json({ error: "Invalid date." }, { status: 400 });
}
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    if (submittedDate < tomorrow) return NextResponse.json({ error: "Date must be tomorrow or later." }, { status: 400 });

    if (isNaN(quantity) || quantity < 1) quantity = 1;

    const safeName = escapeHtml(capitalizeWords(name.slice(0, 50)));
    const safeComments = escapeHtml(comments.slice(0, 500));

    // --- File attachment ---
    let attachments: { filename: string; content: Buffer }[] = [];

if (file && file.size > 0) {
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files allowed." },
      { status: 400 }
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too large (max 5MB)." },
      { status: 400 }
    );
  }

  attachments.push({
    filename: file.name,
    content: Buffer.from(await file.arrayBuffer()),
  });
}

    // --- Send email to all recipients concurrently ---
    await Promise.all(
      recipients.map(recipient =>
        resend.emails.send({
          from: "Enquiry <onboarding@resend.dev>",
          to: recipient,
          subject: "New Milestone Banner Enquiry",
          html: `
            <h2>New Enquiry</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Date:</strong> ${submittedDate.toDateString()}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Banner Type:</strong> ${bannerTypes.join(", ")}</p>
            <p><strong>Comments:</strong> ${safeComments}</p>
          `,
          attachments: attachments.length > 0 ? attachments : undefined,
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}