import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const date = formData.get('date') as string;
    const quantity = formData.get('quantity') as string;
    const comments = formData.get('comments') as string;
    const bannerTypes = formData.getAll('bannerType') as string[];
    const file = formData.get('file') as File | null;

    // Validation
    if (!name || !email) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\s()-]{8,15}$/;
    if (!emailRegex.test(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    if (phone && !phoneRegex.test(phone)) return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    if (bannerTypes.length === 0) return NextResponse.json({ error: 'Please select at least one banner type' }, { status: 400 });

    // File attachment
    let attachments: { filename: string; content: Buffer }[] = [];
    if (file) {
      if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 });
      if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
      attachments.push({ filename: file.name, content: Buffer.from(await file.arrayBuffer()) });
    }

    // Send email
    await resend.emails.send({
      from: 'Enquiry <onboarding@resend.dev>', // replace with verified domain for production
      to: 'pynakerjeremy@gmail.com', // your target email
      subject: 'New Milestone Banner Enquiry',
      html: `
        <h2>New Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Banner Type:</strong> ${bannerTypes.join(', ')}</p>
        <p><strong>Comments:</strong> ${comments}</p>
      `,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}