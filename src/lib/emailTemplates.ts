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

export const getEmailTemplate = (userName: string) => {
  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #fff; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://phaneroo-ph.vercel.app/phanero.png" alt="Phaneroo" style="max-width: 280px; height: auto;" />
      </div>

      <h1 style="text-align: center; font-size: 42px; line-height: 1; color: #FFC630; margin: 20px 0 10px;">
        TODAY IS THE DAY!
      </h1>

      <p style="text-align: center; font-size: 20px; color: #FFD95A; margin-bottom: 40px; letter-spacing: 3px;">
        MANIFESTATION & GLORY
      </p>

      <div style="background: #111; border: 1px solid #272727; padding: 32px; border-radius: 8px; margin-bottom: 30px;">
        <p style="font-size: 18px; line-height: 1.6;">
          Hello <strong>${userName}</strong>,
        </p>

        <p style="font-size: 17px; line-height: 1.65; margin-top: 20px;">
          Today is <strong>Friday, 26th June</strong>—the day we've all been waiting for!
          <strong>Phaneroo Port Harcourt – Manifestation & Glory</strong> begins today.
          Come with great expectation, because the Lord is set to reveal His glory in a mighty way.
        </p>

        <p style="margin-top: 25px; font-size: 16px;">
          <strong>Join us today at 4:00 PM</strong> at Opal Place, NTA Road, Port Harcourt.
          Invite your family and friends, arrive early, and come hungry for an unforgettable encounter with God.
        </p>
      </div>

      <div style="text-align: center; margin: 35px 0;">
        <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=Phaneroo%20Port%20Harcourt&dates=20260626T150000Z/20260627T210000Z&details=Manifestation%20%26%20Glory&location=Opal%20Place%2C%20NTA%20Road%2C%20Port%20Harcourt"
           style="background: #FFC630; color: #000; padding: 16px 32px; text-decoration: none; font-weight: 700; font-size: 16px; border-radius: 4px; display: inline-block;">
          📅 ADD TO CALENDAR
        </a>
      </div>

      <div style="text-align: center; font-size: 15px; color: #aaa; margin-top: 40px;">
        <strong>Fri 26 June • 4:00 PM</strong><br>
        <strong>Sat 27 June • 10:00 AM</strong><br><br>
        Opal Place, NTA Road, Port Harcourt
      </div>

      <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 1px solid #272727; font-size: 12px; color: #555;">
        Ascend • Phaneroo Ministries International
      </div>
    </div>
  `;
};
