import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Resend } from 'resend';
import { getRegistrationEmailTemplate } from '@/lib/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
    }

    const result = await query('SELECT full_name, email FROM registrations');
    const users = result.rows;

    if (users.length === 0) {
      return NextResponse.json({ message: 'No users found to send emails to.' });
    }

    const results = await Promise.allSettled(users.map(async (user) => {
      if (!user.email) return;

      const { data, error } = await resend.emails.send({
        from: `Phaneroo Port Harcourt <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`,
        to: user.email,
        subject: "Registration Confirmed! Phaneroo Port Harcourt",
        html: getRegistrationEmailTemplate(user.full_name),
      });

      if (error) {
        console.error(`Resend API Error for ${user.email}:`, error);
        throw error;
      }
      return data;
    }));

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({ 
      success: true, 
      message: `Attempted to send ${users.length} emails.`,
      stats: { successful, failed }
    });
  } catch (error) {
    console.error('Bulk send error:', error);
    return NextResponse.json({ error: 'Failed to send bulk emails' }, { status: 500 });
  }
}
