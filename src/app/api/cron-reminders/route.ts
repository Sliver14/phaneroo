import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Resend } from "resend";
import { getEmailTemplate } from "@/lib/emailTemplates";
import { sendWhatsAppReminder } from "@/lib/whatsapp";

const resend = new Resend(process.env.RESEND_API_KEY);

// This endpoint should be protected by a secret token in production
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const targetDate = new Date("2026-06-26T16:00:00");
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Define reminder intervals: 7 days, 3 days, 1 day, and 0 (event day)
    const intervals = [7, 3, 1, 0];

    if (!intervals.includes(diffDays)) {
      return NextResponse.json({ message: `No reminder scheduled for ${diffDays} days remaining.` });
    }

    // Fetch all registrations
    const result = await query("SELECT full_name, email, whatsapp FROM registrations");
    const registrations = result.rows;

    if (registrations.length === 0) {
      return NextResponse.json({ message: "No registrations found." });
    }

    const results = await Promise.allSettled(registrations.map(async (reg) => {
      // 1. Send Email if email exists
      if (reg.email) {
        if (!process.env.RESEND_API_KEY) {
          console.error("Missing RESEND_API_KEY for cron reminder");
          return;
        }

        const html = getEmailTemplate(reg.full_name, diffDays);
        const subject = diffDays === 0 
          ? "TODAY IS THE DAY! Phaneroo Port Harcourt" 
          : `${diffDays} Days to Go! Phaneroo Port Harcourt`;

        const { data, error } = await resend.emails.send({
          from: `Phaneroo Port Harcourt <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`,
          to: reg.email,
          subject: subject,
          html: html,
        });

        if (error) {
          console.error(`Resend API Error for ${reg.email}:`, error);
          throw error; // Reject to count as failed in allSettled
        }
      }

      // 2. Send WhatsApp if number exists and template is configured
      if (reg.whatsapp && process.env.WHATSAPP_TEMPLATE_NAME) {
        await sendWhatsAppReminder(
          reg.whatsapp,
          process.env.WHATSAPP_TEMPLATE_NAME,
          reg.full_name,
          diffDays
        );
      }
    }));

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${registrations.length} registrations for the ${diffDays}-day interval.`,
      stats: { successful, failed }
    });

  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 });
  }
}
