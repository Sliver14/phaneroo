const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const WHATSAPP_VERSION = 'v22.0';

export async function sendWhatsAppReminder(
  to: string,
  templateName: string,
  userName: string,
  daysRemaining: number
) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.warn('WhatsApp credentials missing. Skipping message.');
    return { success: false, error: 'Missing credentials' };
  }

  // Sanitize phone number (remove +, spaces, and ensure it's digits)
  const sanitizedTo = to.replace(/\D/g, '');

  try {
    const response = await fetch(
      `https://graph.facebook.com/${WHATSAPP_VERSION}/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: sanitizedTo,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'en_US' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: userName },
                  { type: 'text', text: daysRemaining === 0 ? 'Today' : String(daysRemaining) },
                ],
              },
            ],
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('WhatsApp API Error:', data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    console.error('WhatsApp Fetch Error:', error);
    return { success: false, error };
  }
}
