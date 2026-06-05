import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, whatsapp, attendance, bus, busAddress } = body;

    const result = await query(
      `INSERT INTO registrations (full_name, email, whatsapp, attendance, bus, bus_address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [fullName, email, whatsapp, attendance, bus, busAddress]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save registration" },
      { status: 500 }
    );
  }
}
