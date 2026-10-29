import { NextRequest, NextResponse } from "next/server";
import { createOtp } from "@/lib/otp";
import { z } from "zod";

const SendOtpSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

async function sendOtpEmail(email: string, name: string, code: string) {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      return { sent: false, error: "Email not configured" };
    }

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass },
    });

    const html = `
<div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; background: #F4ECD8; padding: 40px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1A3D2A; letter-spacing: 0.15em; font-size: 28px; margin: 0;">HAIR LAB.</h1>
    <p style="color: #B8860B; letter-spacing: 0.3em; font-size: 11px; text-transform: uppercase; margin-top: 5px;">Ancient Luxury, Handcrafted</p>
  </div>
  
  <h2 style="color: #2C2416; font-size: 22px; margin-bottom: 20px;">Verify your email 🍃</h2>
  
  <p style="color: #2C2416; line-height: 1.6;">
    Hi ${name},
  </p>
  
  <p style="color: #2C2416; line-height: 1.6;">
    Use this code to verify your email and complete your order:
  </p>
  
  <div style="text-align: center; margin: 30px 0;">
    <div style="display: inline-block; background: white; padding: 20px 40px; border-radius: 4px; border: 2px solid #B8860B; font-family: monospace; font-size: 32px; letter-spacing: 0.5em; color: #1A3D2A; font-weight: bold;">
      ${code}
    </div>
  </div>
  
  <p style="color: #2C2416; font-size: 13px; line-height: 1.6;">
    This code expires in <strong>10 minutes</strong>. If you didn't request this, you can ignore this email.
  </p>
  
  <hr style="border: none; border-top: 1px solid #2C2416/10; margin: 30px 0;">
  
  <p style="color: #57606a; font-size: 11px; line-height: 1.6;">
    Made with intention,<br>
    Sruwa Kesiraju · HAIR LAB.<br>
    hairlabhyd@gmail.com · +91 95021 94263<br>
    https://hairlab.one
  </p>
</div>
    `;

    const text = `
Hi ${name},

Your HAIR LAB. verification code is: ${code}

This code expires in 10 minutes.

If you didn't request this, you can ignore this email.

Made with intention,
Sruwa Kesiraju · HAIR LAB.
    `;

    await transporter.sendMail({
      from: `"HAIR LAB." <${emailUser}>`,
      to: email,
      subject: `HAIR LAB. — Your verification code: ${code}`,
      text,
      html,
    });

    return { sent: true };
  } catch (e: any) {
    console.error("📧 OTP email failed:", e.message);
    return { sent: false, error: e.message };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SendOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const { email, name } = parsed.data;

    // Create OTP (throws if user is in cooldown period)
    let code: string;
    try {
      const result = createOtp(email);
      code = result.code;
    } catch (e: any) {
      return NextResponse.json(
        { error: e.message },
        { status: 429 }
      );
    }

    // Send email
    const emailResult = await sendOtpEmail(email, name || "Customer", code);

    if (!emailResult.sent) {
      return NextResponse.json(
        { error: "Could not send OTP email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${email}`,
      expiresIn: "10 minutes",
    });
  } catch (e: any) {
    console.error("❌ /api/auth/send-otp error:", e);
    return NextResponse.json(
      { error: "Could not send OTP" },
      { status: 500 }
    );
  }
}
