import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import nodemailer from "nodemailer";
import { getEmailTemplate } from "@/lib/emailTemplates";

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
    const result = await query("SELECT full_name, email FROM registrations WHERE email IS NOT NULL");
    const registrations = result.rows;

    if (registrations.length === 0) {
      return NextResponse.json({ message: "No registrations found." });
    }

    // Configure nodemailer (Use your actual SMTP settings in .env.local)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const sendPromises = registrations.map(async (reg) => {
      const html = getEmailTemplate(reg.full_name, diffDays);
      const subject = diffDays === 0 
        ? "TODAY IS THE DAY! Phaneroo Port Harcourt" 
        : `${diffDays} Days to Go! Phaneroo Port Harcourt`;

      return transporter.sendMail({
        from: `"Phaneroo Port Harcourt" <${process.env.EMAIL_FROM}>`,
        to: reg.email,
        subject: subject,
        html: html,
      });
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ 
      success: true, 
      message: `Sent ${registrations.length} reminders for the ${diffDays}-day interval.` 
    });

  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 });
  }
}
