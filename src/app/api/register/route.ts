import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Resend } from "resend";
import { getRegistrationEmailTemplate } from "@/lib/emailTemplates";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send confirmation email via Resend
    try {
      if (!process.env.RESEND_API_KEY) {
        console.error("Missing RESEND_API_KEY");
      } else {
        const { data, error } = await resend.emails.send({
          from: `Phaneroo Port Harcourt <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`,
          to: email,
          subject: "Registration Confirmed! Phaneroo Port Harcourt",
          html: getRegistrationEmailTemplate(fullName),
        });

        if (error) {
          console.error("Resend API Error:", error);
        } else {
          console.log("Email sent successfully:", data?.id);
        }
      }
    } catch (mailError) {
      console.error("Resend connection error:", mailError);
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
