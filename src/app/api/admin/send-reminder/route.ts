// src/app/api/admin/send-reminder/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Resend } from 'resend';
import { getEmailTemplate } from '@/lib/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query('SELECT full_name, email FROM registrations WHERE email IS NOT NULL');
    const users = result.rows;

    if (users.length === 0) {
      return NextResponse.json({ message: 'No users found.' });
    }

    const BATCH_SIZE = 100;
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const chunk = users.slice(i, i + BATCH_SIZE);
      
      const batchData = chunk.map(user => ({
        from: `Phaneroo Port Harcourt <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`,
        to: user.email,
        subject: "TOMORROW IS THE DAY! — Phaneroo Port Harcourt",
        html: getEmailTemplate(user.full_name, 1), // 1 = tomorrow
      }));

      try {
        const { data, error } = await resend.batch.send(batchData);
        if (error) {
          failed += chunk.length;
        } else {
          successful += chunk.length;
        }
      } catch (err) {
        failed += chunk.length;
      }

      if (i + BATCH_SIZE < users.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({ 
      success: true, 
      stats: { successful, failed }
    });

  } catch (error) {
    console.error('Reminder error:', error);
    return NextResponse.json({ error: 'Failed to send reminders' }, { status: 500 });
  }
}