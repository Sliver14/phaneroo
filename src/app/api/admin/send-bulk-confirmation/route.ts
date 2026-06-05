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
    const users = result.rows.filter(u => u.email);

    if (users.length === 0) {
      return NextResponse.json({ message: 'No users found to send emails to.' });
    }

    const BATCH_SIZE = 100;
    let successful = 0;
    let failed = 0;

    // Split users into chunks of 100 (Resend batch limit)
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const chunk = users.slice(i, i + BATCH_SIZE);
      
      const batchData = chunk.map(user => ({
        from: `Phaneroo Port Harcourt <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`,
        to: user.email,
        subject: "Registration Confirmed! Phaneroo Port Harcourt",
        html: getRegistrationEmailTemplate(user.full_name),
      }));

      try {
        const { data, error } = await resend.batch.send(batchData);
        
        if (error) {
          console.error(`Resend Batch API Error (Chunk ${i/BATCH_SIZE}):`, error);
          failed += chunk.length;
        } else {
          successful += chunk.length;
          console.log(`Batch ${i/BATCH_SIZE} sent successfully`);
        }
      } catch (err) {
        console.error(`Failed to send batch ${i/BATCH_SIZE}:`, err);
        failed += chunk.length;
      }

      // Add a 1-second delay between batch requests to safely stay under 5 requests/sec limit
      if (i + BATCH_SIZE < users.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${users.length} emails.`,
      stats: { successful, failed }
    });
  } catch (error) {
    console.error('Bulk send error:', error);
    return NextResponse.json({ error: 'Failed to send bulk emails' }, { status: 500 });
  }
}
