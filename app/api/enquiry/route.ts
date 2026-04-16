// app/api/enquiry/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const DEFAULT_ENQUIRY_RECIPIENT = "sam@geckosigns.net.au";
const DEFAULT_FROM_EMAIL = "enquiries@geckosigns.net.au";
const DEFAULT_FROM_NAME = "Milestone Banners";

// --- In-memory rate limiter (per IP) ---
const rateLimitMap: Record<string, number[]> = {};
const RATE_LIMIT = 2; // requests
const RATE_WINDOW = 10 * 60 * 1000; // 10 minutes

// --- Swear word list ---
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

// --- Recipients ---
const recipients =
  process.env.ENQUIRY_RECIPIENTS?.split(",").map((e) => e.trim()).filter(Boolean) || [
    DEFAULT_ENQUIRY_RECIPIENT,
  ];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

type OptionalUpload = File | null;

const getOptionalUpload = (value: FormDataEntryValue | null): OptionalUpload => {
  if (!(value instanceof File)) {
    return null;
  }

  if (!value.name || value.size === 0) {
    return null;
  }

  return value;
};

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  return new Resend(apiKey);
};

const getFromAddress = () => {
  const fromEmail = process.env.ENQUIRY_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
  const fromName = process.env.ENQUIRY_FROM_NAME?.trim() || DEFAULT_FROM_NAME;

  return `${fromName} <${fromEmail}>`;
};

export async function POST(req: Request) {
  try {
    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const resend = getResendClient();
    const fromAddress = getFromAddress();

    // --- IP detection (safe) ---
    const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0];

    // --- Rate limiting ---
    const now = Date.now();

    if (!rateLimitMap[ip]) rateLimitMap[ip] = [];

    rateLimitMap[ip] = rateLimitMap[ip].filter(
      (t) => now - t < RATE_WINDOW
    );

    if (rateLimitMap[ip].length >= RATE_LIMIT) {
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { status: 429 }
      );
    }

    rateLimitMap[ip].push(now);

    // --- Form data ---
    const formData = await req.formData();

    const name = (formData.get("name") as string) || "";
    const email = (formData.get("email") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const date = (formData.get("date") as string) || "";
    let quantity = parseInt((formData.get("quantity") as string) || "1");
    const comments = (formData.get("comments") as string) || "";
    const bannerTypeText = (formData.get("bannerTypeText") as string) || "";
    const bannerTypes = formData.getAll("bannerType") as string[];
    const file = getOptionalUpload(formData.get("file"));

    // --- Validation ---
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and Email are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const phoneRegex = /^[0-9+\s()-]{8,15}$/;
    if (phone && !phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number." },
        { status: 400 }
      );
    }

    if (bannerTypes.length === 0) {
      return NextResponse.json(
        { error: "Select at least one banner type." },
        { status: 400 }
      );
    }

    const combinedText = `${name} ${comments}`.toLowerCase();
    if (bannedWords.some((word) => combinedText.includes(word))) {
      return NextResponse.json(
        { error: "Swear words are not allowed." },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: "Date is required." },
        { status: 400 }
      );
    }

    const submittedDate = new Date(date);

    if (isNaN(submittedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date." },
        { status: 400 }
      );
    }

    submittedDate.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (submittedDate < tomorrow) {
      return NextResponse.json(
        { error: "Date must be tomorrow or later." },
        { status: 400 }
      );
    }

    if (isNaN(quantity) || quantity < 1) quantity = 1;

    const safeName = escapeHtml(capitalizeWords(name.slice(0, 50)));
    const safeComments = escapeHtml(comments.slice(0, 500));
    const safeBannerTypeText = escapeHtml(capitalizeWords(bannerTypeText.slice(0, 50)));
    const safePhone = escapeHtml(phone.slice(0, 20));
    const safeEmail = escapeHtml(email.slice(0, 100));

    // --- File attachment ---
    const attachments: { filename: string; content: Buffer }[] = [];

    if (file) {
      if (!file.type || !file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Only image files allowed." },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
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

    // --- Send email ---
    await Promise.all(
      recipients.map((recipient) =>
        resend.emails.send({
          from: fromAddress,
          to: recipient,
          replyTo: email,
          subject: "New Milestone Banner Enquiry",
          html: `
            <h2>New Enquiry</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Phone:</strong> ${safePhone || "Not provided"}</p>
            <p><strong>Date:</strong> ${submittedDate.toDateString()}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Banner Type:</strong> ${bannerTypes.join(", ")}</p>
            <p><strong>Club:</strong> ${safeBannerTypeText || "Not provided"}</p>
            <p><strong>Comments:</strong> ${safeComments}</p>
            <p><strong>Photo Attached:</strong> ${file ? "Yes" : "No"}</p>
          `,
          attachments: attachments.length > 0 ? attachments : undefined,
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}