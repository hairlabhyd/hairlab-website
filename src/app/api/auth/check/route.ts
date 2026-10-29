import { NextRequest, NextResponse } from "next/server";
import { isOtpVerified } from "@/lib/otp";
import { z } from "zod";

const CheckSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const verified = isOtpVerified(email);

    return NextResponse.json({
      verified,
      email,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Could not check verification" },
      { status: 500 }
    );
  }
}
