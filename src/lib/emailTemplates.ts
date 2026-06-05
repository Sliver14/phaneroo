export const getGoogleCalendarLink = () => {
  const event = {
    title: "Phaneroo Port Harcourt: Manifestation & Glory",
    description: "Prepare your heart for a manifestation of glory at Opal Place.",
    location: "Opal Place, NTA Road, Port Harcourt",
    startTime: "20260626T150000Z", // June 26, 4:00 PM (assuming UTC+1 for PH, so 15:00 UTC)
    endTime: "20260627T210000Z",   // June 27
  };

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(
    event.location
  )}&dates=${event.startTime}/${event.endTime}`;
};

export const getRegistrationEmailTemplate = (userName: string) => {
  const calendarLink = getGoogleCalendarLink();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://phaneroo-ph.vercel.app";
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;700&family=Bebas+Neue&display=swap');
        body {
          background-color: #0A0A0A;
          color: #FFFFFF;
          font-family: 'Barlow', sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #111111;
          border-top: 4px solid #F5C518;
        }
        .header {
          padding: 0;
          text-align: center;
          background-color: #000000;
        }
        .banner {
          width: 100%;
          display: block;
        }
        .content {
          padding: 40px 30px;
          line-height: 1.6;
        }
        .greeting {
          font-size: 20px;
          font-weight: 700;
          color: #F5C518;
          margin-bottom: 10px;
        }
        .message {
          font-size: 16px;
          color: #CCCCCC;
          margin-bottom: 30px;
        }
        .event-box {
          background-color: #1A1A1A;
          border: 1px solid #272727;
          padding: 20px;
          margin-bottom: 30px;
        }
        .event-detail {
          margin-bottom: 15px;
          font-size: 14px;
        }
        .event-detail strong {
          color: #F5C518;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 4px;
        }
        .footer {
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #444444;
          border-top: 1px solid #1A1A1A;
        }
        .button {
          display: inline-block;
          background-color: #F5C518;
          color: #0A0A0A;
          padding: 15px 30px;
          text-decoration: none;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 10px;
        }
        .calendar-button {
          display: inline-block;
          background-color: transparent;
          color: #F5C518;
          padding: 13px 28px;
          text-decoration: none;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 10px;
          border: 2px solid #F5C518;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${baseUrl}/phanero.png" alt="Phaneroo Port Harcourt" class="banner">
        </div>
        
        <div class="content">
          <div class="greeting">Registration Confirmed!</div>
          <div class="message">
            Hello ${userName}, you have successfully registered for <strong>Phaneroo Port Harcourt: Manifestation & Glory</strong>. We are expectant for a life-transforming encounter!
          </div>
          
          <div class="event-box">
            <div class="event-detail">
              <strong>Theme</strong>
              Manifestation & Glory
            </div>
            <div class="event-detail">
              <strong>Date & Time</strong>
              Fri 26 (4pm) & Sat 27 (10am) June 2026
            </div>
            <div class="event-detail">
              <strong>Location</strong>
              Opal Place, NTA Road, Port Harcourt
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${calendarLink}" class="calendar-button">Add to Calendar</a>
          </div>
        </div>
        
        <div class="footer">
          &copy; 2026 Phaneroo Ministries International. All rights reserved.<br>
          Ascend · Manifestation & Glory
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getEmailTemplate = (userName: string, daysRemaining: number) => {
  const isEventDay = daysRemaining === 0;
  const headline = isEventDay ? "TODAY IS THE DAY!" : `${daysRemaining} DAYS TO GO!`;
  const subheadline = isEventDay 
    ? "The glory of the Lord is about to be revealed."
    : "Prepare your heart for a manifestation of glory.";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://phaneroo-ph.vercel.app";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;700&family=Bebas+Neue&display=swap');
        body {
          background-color: #0A0A0A;
          color: #FFFFFF;
          font-family: 'Barlow', sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #111111;
          border-top: 4px solid #F5C518;
        }
        .header {
          padding: 0;
          text-align: center;
          background-color: #000000;
        }
        .banner {
          width: 100%;
          display: block;
        }
        .eyebrow {
          color: #F5C518;
          font-size: 12px;
          letter-spacing: 4px;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .headline {
          font-family: 'Bebas Neue', cursive;
          font-size: 48px;
          color: #FFFFFF;
          margin: 0;
          line-height: 1;
        }
        .content {
          padding: 40px 30px;
          line-height: 1.6;
        }
        .greeting {
          font-size: 20px;
          font-weight: 700;
          color: #F5C518;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          color: #CCCCCC;
          margin-bottom: 30px;
        }
        .event-box {
          background-color: #1A1A1A;
          border: 1px solid #272727;
          padding: 20px;
          margin-bottom: 30px;
        }
        .event-detail {
          margin-bottom: 10px;
          font-size: 14px;
        }
        .event-detail strong {
          color: #F5C518;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 1px;
          display: block;
        }
        .footer {
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #444444;
          border-top: 1px solid #1A1A1A;
        }
        .button {
          display: inline-block;
          background-color: #F5C518;
          color: #0A0A0A;
          padding: 15px 30px;
          text-decoration: none;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${baseUrl}/phanero.png" alt="Phaneroo Port Harcourt" class="banner">
        </div>
        
        <div class="content">
          <div style="text-align: center; margin-bottom: 30px;">
            <div class="eyebrow">Phaneroo Port Harcourt</div>
            <h1 class="headline">${headline}</h1>
            <p style="color: #C9A000; font-family: 'Bebas Neue', cursive; font-size: 18px; letter-spacing: 3px; margin-top: 10px;">Manifestation & Glory</p>
          </div>

          <div class="greeting">Hello ${userName},</div>
          <div class="message">
            ${subheadline} We are expectant and ready to witness what the Lord has in store for us at Opal Place.
          </div>
          
          <div class="event-box">
            <div class="event-detail">
              <strong>Date & Time</strong>
              Fri 26 (4pm) & Sat 27 (10am) June 2026
            </div>
            <div class="event-detail">
              <strong>Location</strong>
              Opal Place, NTA Road, Port Harcourt
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${baseUrl}" class="button">See You There</a>
          </div>
        </div>
        
        <div class="footer">
          &copy; 2026 Phaneroo Ministries International. All rights reserved.<br>
          Ascend · Manifestation & Glory
        </div>
      </div>
    </body>
    </html>
  `;
};
