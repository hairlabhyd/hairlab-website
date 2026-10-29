// Unified notification system
// Sends order notifications to Sruwa via 3 channels:
// 1. Email (Gmail via nodemailer)
// 2. WhatsApp (Twilio WhatsApp API)
// 3. Telegram (Telegram Bot API)
//
// All 3 are optional — if env vars aren't set, that channel is skipped.
// This way, you get notifications on whichever channels you configure.

import { Order } from "@/lib/orders";

interface NotificationResult {
  email: { sent: boolean; error?: string };
  whatsapp: { sent: boolean; error?: string };
  telegram: { sent: boolean; error?: string };
}

export async function sendOrderNotifications(order: Order): Promise<NotificationResult> {
  const results: NotificationResult = {
    email: { sent: false },
    whatsapp: { sent: false },
    telegram: { sent: false },
  };

  // Send to all 3 channels in parallel (don't wait for each)
  const [emailResult, whatsappResult, telegramResult] = await Promise.allSettled([
    sendEmailNotification(order),
    sendWhatsAppNotification(order),
    sendTelegramNotification(order),
  ]);

  if (emailResult.status === "fulfilled") {
    results.email = emailResult.value;
  } else {
    results.email = { sent: false, error: emailResult.reason?.message };
  }

  if (whatsappResult.status === "fulfilled") {
    results.whatsapp = whatsappResult.value;
  } else {
    results.whatsapp = { sent: false, error: whatsappResult.reason?.message };
  }

  if (telegramResult.status === "fulfilled") {
    results.telegram = telegramResult.value;
  } else {
    results.telegram = { sent: false, error: telegramResult.reason?.message };
  }

  console.log("📱 Notification results:", JSON.stringify(results, null, 2));
  return results;
}

function formatOrderMessage(order: Order): string {
  const items = order.items
    .map((i) => `• ${i.name} × ${i.quantity} — ₹${(i.price / 100).toFixed(0)}`)
    .join("\n");

  const paymentLabel = order.paymentMethod === "cod" ? "COD" : "Paid Online";
  const shippingLabel = order.shipping === 0 ? "FREE" : `₹${(order.shipping / 100).toFixed(0)}`;
  const codLabel = order.codFee > 0 ? `+ ₹${(order.codFee / 100).toFixed(0)} COD` : "";

  return `🛒 NEW ORDER — HAIR LAB.

Customer: ${order.customerName}
Phone: ${order.customerPhone}
Email: ${order.customerEmail}

📦 Products:
${items}

💰 Total: ₹${(order.amount / 100).toFixed(0)} (${paymentLabel})
Shipping: ${shippingLabel} ${codLabel}

📍 Ship to:
${order.shippingAddress}
${order.shippingCity}, ${order.shippingState} ${order.shippingPincode}

Order ID: ${order.id}
Placed: ${new Date(order.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;
}

// ─────────────────────────────────────────────────────────────────
// 1. EMAIL NOTIFICATION (Gmail via nodemailer)
// ─────────────────────────────────────────────────────────────────
async function sendEmailNotification(order: Order): Promise<{ sent: boolean; error?: string }> {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      return { sent: false, error: "EMAIL_USER or EMAIL_PASS not set" };
    }

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass },
    });

    const subject =
      order.paymentMethod === "cod"
        ? `🛒 COD Order: ${order.customerName} — ₹${(order.amount / 100).toFixed(0)}`
        : `🛒 New Order: ${order.customerName} — ₹${(order.amount / 100).toFixed(0)} (Paid)`;

    // Notify Sruwa
    await transporter.sendMail({
      from: `"HAIR LAB. Orders" <${emailUser}>`,
      to: "hairlabhyd@gmail.com",
      subject,
      text: formatOrderMessage(order),
    });

    // Also send confirmation to customer
    await transporter.sendMail({
      from: `"HAIR LAB." <${emailUser}>`,
      to: order.customerEmail,
      subject: `HAIR LAB. — Your order is confirmed 🍃`,
      text: `Hi ${order.customerName},

${order.paymentMethod === "cod"
  ? `Your order is confirmed! Pay ₹${(order.amount / 100).toFixed(0)} when it arrives (5-10 days).`
  : `Payment received! Your ritual begins tonight.`}

ORDER DETAILS
─────────────
Order ID: ${order.id}
Total: ₹${(order.amount / 100).toFixed(0)}
Payment: ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid online"}

PRODUCTS
─────────────
${order.items.map((i) => `• ${i.name} × ${i.quantity} — ₹${(i.price / 100).toFixed(0)}`).join("\n")}

SHIPPING TO
─────────────
${order.customerName}
${order.shippingAddress}
${order.shippingCity}, ${order.shippingState} ${order.shippingPincode}

We'll send tracking once it ships.

Made with intention,
Sruwa Kesiraju
HAIR LAB.
hairlabhyd@gmail.com · +91 95021 94263
https://hairlab.one`,
    });

    return { sent: true };
  } catch (e: any) {
    console.error("📧 Email notification failed:", e.message);
    return { sent: false, error: e.message };
  }
}

// ─────────────────────────────────────────────────────────────────
// 2. WHATSAPP NOTIFICATION (via Twilio WhatsApp API)
// ─────────────────────────────────────────────────────────────────
async function sendWhatsAppNotification(order: Order): Promise<{ sent: boolean; error?: string }> {
  try {
    const twilioSid = process.env.TWILIO_SID;
    const twilioToken = process.env.TWILIO_TOKEN;
    const twilioWhatsAppFrom = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"
    const sruwaWhatsApp = process.env.SRUWA_WHATSAPP; // e.g. "whatsapp:+919502194263"

    if (!twilioSid || !twilioToken || !twilioWhatsAppFrom || !sruwaWhatsApp) {
      return { sent: false, error: "Twilio env vars not set" };
    }

    const message = formatOrderMessage(order);

    const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: twilioWhatsAppFrom,
          To: sruwaWhatsApp,
          Body: message,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Twilio API error");
    }

    return { sent: true };
  } catch (e: any) {
    console.error("📱 WhatsApp notification failed:", e.message);
    return { sent: false, error: e.message };
  }
}

// ─────────────────────────────────────────────────────────────────
// 3. TELEGRAM NOTIFICATION (via Telegram Bot API — FREE)
// ─────────────────────────────────────────────────────────────────
async function sendTelegramNotification(order: Order): Promise<{ sent: boolean; error?: string }> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return { sent: false, error: "Telegram env vars not set" };
    }

    const message = formatOrderMessage(order);

    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.description || "Telegram API error");
    }

    return { sent: true };
  } catch (e: any) {
    console.error("📱 Telegram notification failed:", e.message);
    return { sent: false, error: e.message };
  }
}
