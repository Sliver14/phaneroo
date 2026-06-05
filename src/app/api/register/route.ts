import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import nodemailer from "nodemailer";
import { getRegistrationEmailTemplate } from "@/lib/emailTemplates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, whatsapp, attendance, bus, busAddress } = body;

    // Check if email already exists
    const existing = await query(
      "SELECT * FROM registrations WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json({ 
        success: true, 
        alreadyRegistered: true, 
        data: existing.rows[0] 
      });
    }

    // Insert new registration
    const result = await query(
      `INSERT INTO registrations (full_name, email, whatsapp, attendance, bus, bus_address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [fullName, email, whatsapp, attendance, bus, busAddress]
    );

    const newRegistration = result.rows[0];

    // Send confirmation email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Phaneroo Port Harcourt" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: "Registration Confirmed! Phaneroo Port Harcourt",
        html: getRegistrationEmailTemplate(fullName),
      });
    } catch (mailError) {
      console.error("Email sending error:", mailError);
      // We don't fail the registration if the email fails, but we log it
    }

    return NextResponse.json({ 
      success: true, 
      alreadyRegistered: false, 
      data: newRegistration 
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save registration" },
      { status: 500 }
    );
  }
}
