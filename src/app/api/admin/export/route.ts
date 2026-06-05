import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const result = await query(
      'SELECT full_name, email, whatsapp, attendance, bus, bus_address, created_at FROM registrations ORDER BY created_at DESC'
    );

    const users = result.rows.map(user => ({
      'Full Name': user.full_name,
      'Email': user.email,
      'WhatsApp': user.whatsapp,
      'Attendance': user.attendance,
      'Bus Needed': user.bus,
      'Bus Address': user.bus_address,
      'Registration Date': new Date(user.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="phaneroo_registrations.xlsx"',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Export failed', { status: 500 });
  }
}
