import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";
import { z } from "zod";

const VerifyOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifyOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request — need email + 6-digit code" },
        { status: 400 }
      );
    }

    const { email, code } = parsed.data;
    const result = verifyOtp(email, code);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.reason || "Verification failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email verified! You can place your order now.",
    });
  } catch (e: any) {
    console.error("❌ /api/auth/verify-otp error:", e);
    return NextResponse.json(
      { error: "Could not verify OTP" },
      { status: 500 }
    );
  }
}
