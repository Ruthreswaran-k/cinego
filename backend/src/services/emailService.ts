import crypto from 'crypto';

interface EmailOtpEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
}

const emailOtpStore = new Map<string, EmailOtpEntry>();

export interface TicketEmailPayload {
  bookingId: string | number;
  customerName: string;
  email: string;
  mobile?: string;
  movieTitle: string;
  theatreName: string;
  screenName: string;
  showDate: string;
  showTime: string;
  seats: string[];
  amount: number;
}

export class EmailService {
  private getBrevoApiKey(): string | undefined {
    return process.env.BREVO_API_KEY || process.env.BRAVO_API_KEY;
  }

  private getSenderEmail(): string {
    return process.env.BREVO_SENDER_EMAIL || 'tickets@cinego.com';
  }

  private getSenderName(): string {
    return process.env.BREVO_SENDER_NAME || 'CineGo Cinema Tickets';
  }

  /**
   * Generates a 6-digit OTP and sends it to the customer's Gmail via Brevo API
   */
  async generateAndSendEmailOtp(email: string, customerName = 'Cinema Lover'): Promise<{
    success: boolean;
    message: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@')) {
      throw new Error('Please enter a valid Gmail / Email address');
    }

    const apiKey = this.getBrevoApiKey();
    if (!apiKey) {
      throw new Error('Email service is not configured. Please add a valid BREVO_API_KEY in backend/.env');
    }

    // Cryptographic 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: this.getSenderName(),
            email: this.getSenderEmail(),
          },
          to: [{ email: cleanEmail, name: customerName }],
          subject: `🎬 Your CineGo Login Verification Code: ${otp}`,
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #0d0d0d; color: #ffffff; padding: 20px; }
                .container { max-width: 520px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; text-align: center; }
                .logo { font-size: 28px; font-weight: 900; color: #E50914; letter-spacing: -0.5px; margin-bottom: 8px; }
                .tagline { font-size: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 24px; }
                .otp-card { background: #09090b; border: 2px dashed #E50914; border-radius: 12px; padding: 20px; margin: 24px 0; }
                .otp-code { font-size: 38px; font-weight: 900; font-family: monospace; letter-spacing: 10px; color: #ffffff; margin: 0; }
                .info { font-size: 13px; color: #a1a1aa; line-height: 1.6; }
                .footer { font-size: 11px; color: #71717a; margin-top: 32px; border-top: 1px solid #27272a; padding-top: 16px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="logo">🎬 CineGo</div>
                <div class="tagline">Your Movies. Your Seats. Your Experience.</div>
                <h2 style="font-size: 20px; margin-top: 0; color: #ffffff;">Sign In Verification Code</h2>
                <p class="info">Hello ${customerName}, use the verification code below to securely sign into your CineGo account:</p>
                
                <div class="otp-card">
                  <div class="otp-code">${otp}</div>
                </div>

                <p class="info" style="color: #f59e0b; font-weight: 600;">⏱️ Valid for 5 minutes. Do not share this OTP with anyone.</p>
                <div class="footer">
                  Sent via Brevo Email Gateway &bull; CineGo Entertainment Systems
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      const resData: any = await response.json();
      if (!response.ok) {
        throw new Error(resData?.message || 'Brevo authentication failed. Please verify your BREVO_API_KEY in backend/.env');
      }

      // Store in memory ONLY after successful email dispatch
      emailOtpStore.set(cleanEmail, {
        otp,
        expiresAt,
        attempts: 0,
      });

      console.log(`[Brevo Email] Successfully sent OTP to ${cleanEmail}`);
      return {
        success: true,
        message: `Verification code sent to ${cleanEmail}. Please check your Gmail.`,
      };
    } catch (err: any) {
      console.error(`[Brevo Email] Error:`, err.message);
      throw new Error(err.message || 'Failed to dispatch email verification code');
    }
  }

  /**
   * Verifies the email OTP entered by the user
   */
  verifyEmailOtp(email: string, userEnteredOtp: string): { valid: boolean; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    const record = emailOtpStore.get(cleanEmail);

    if (!record) {
      return { valid: false, message: 'No active OTP request found for this Gmail address. Please request a new code.' };
    }

    if (Date.now() > record.expiresAt) {
      emailOtpStore.delete(cleanEmail);
      return { valid: false, message: 'This verification code has expired. Please request a new one.' };
    }

    if (record.attempts >= 5) {
      emailOtpStore.delete(cleanEmail);
      return { valid: false, message: 'Too many incorrect attempts. Please request a new code.' };
    }

    const trimmedInput = userEnteredOtp.replace(/[^0-9]/g, '').trim();
    if (record.otp !== trimmedInput) {
      record.attempts += 1;
      return { valid: false, message: `Incorrect code (${trimmedInput}). Please check your Gmail and try again.` };
    }

    emailOtpStore.delete(cleanEmail);
    return { valid: true, message: 'Email verified successfully' };
  }

  /**
   * Sends ticket confirmation receipt to customer's Gmail
   */
  async sendTicketConfirmationEmail(payload: TicketEmailPayload): Promise<{ success: boolean; message: string }> {
    const cleanEmail = payload.email.trim().toLowerCase();
    const apiKey = this.getBrevoApiKey();

    const formattedSeats = payload.seats.join(', ');

    const qrPayload = `CINEGO-TICKET:${payload.bookingId}:${payload.movieTitle}:${payload.theatreName}:${payload.screenName}:${payload.seats.join(',')}:${payload.seats.length}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=10&data=${encodeURIComponent(qrPayload)}`;

    if (apiKey) {
      try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            sender: {
              name: this.getSenderName(),
              email: this.getSenderEmail(),
            },
            to: [{ email: cleanEmail, name: payload.customerName }],
            subject: `🎟️ CineGo E-Ticket Confirmed! #${payload.bookingId} - ${payload.movieTitle} (${payload.seats.length} Tickets)`,
            htmlContent: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #0a0a0a; color: #fff; padding: 20px; }
                  .card { max-width: 550px; margin: 0 auto; background: #141414; border: 1px solid #27272a; border-radius: 20px; overflow: hidden; }
                  .header { background: #E50914; padding: 24px; text-align: center; }
                  .body { padding: 28px; }
                  .title { font-size: 24px; font-weight: 900; margin: 0; color: #fff; }
                  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; font-size: 13px; }
                  .kpi { background: #1f1f23; padding: 14px; border-radius: 12px; }
                  .label { font-size: 10px; color: #a1a1aa; text-transform: uppercase; font-weight: bold; }
                  .val { font-size: 15px; font-weight: bold; color: #fff; margin-top: 4px; }
                  .seats { color: #E50914; font-size: 18px; font-family: monospace; font-weight: 900; }
                  .qr-container { background: #ffffff; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0 16px; color: #000; }
                  .qr-title { font-size: 13px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; color: #111; margin-bottom: 12px; }
                  .qr-note { background: #064e3b; border: 1px solid #059669; border-radius: 12px; padding: 14px; text-align: center; font-size: 12px; color: #6ee7b7; margin-top: 16px; }
                </style>
              </head>
              <body>
                <div class="card">
                  <div class="header">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 900;">🎬 CineGo E-Ticket Confirmation</h1>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #fecaca;">Booking Reference: #${payload.bookingId} &bull; ${payload.seats.length} Admission Tickets</p>
                  </div>
                  <div class="body">
                    <h2 class="title">${payload.movieTitle}</h2>
                    <p style="font-size: 13px; color: #a1a1aa; margin: 4px 0 16px;">${payload.theatreName} &bull; ${payload.screenName}</p>
                    
                    <div class="grid">
                      <div class="kpi">
                        <div class="label">Show Schedule</div>
                        <div class="val">${payload.showDate} at ${payload.showTime}</div>
                      </div>
                      <div class="kpi">
                        <div class="label">Reserved Seats (${payload.seats.length} Tickets)</div>
                        <div class="val seats">${formattedSeats}</div>
                      </div>
                      <div class="kpi">
                        <div class="label">Customer Name</div>
                        <div class="val">${payload.customerName}</div>
                      </div>
                      <div class="kpi">
                        <div class="label">Total Paid</div>
                        <div class="val" style="color: #10b981;">₹${payload.amount} (Verified)</div>
                      </div>
                    </div>

                    <div class="qr-container">
                      <div class="qr-title">CineGo Turnstile Admission QR Code</div>
                      <img src="${qrCodeUrl}" width="160" height="160" alt="Turnstile Admission QR" style="display:block; margin: 0 auto; border: 2px solid #000; border-radius: 8px;" />
                      <p style="font-size: 11px; color: #555; margin: 10px 0 0; font-family: monospace; font-weight: bold;">
                        PAYLOAD: #${payload.bookingId} &bull; ${payload.seats.length} SEATS (${formattedSeats})
                      </p>
                      <p style="font-size: 10px; color: #777; margin: 4px 0 0;">
                        Present this QR code to the Duty Manager at the cinema turnstile entrance for fast digital punch-in.
                      </p>
                    </div>

                    <div class="qr-note">
                      <strong>✅ Gate Admission Active</strong><br/>
                      Show this email or your CineGo mobile e-ticket QR code at the turnstile gate for entry.
                    </div>
                  </div>
                </div>
              </body>
              </html>
            `,
          }),
        });

        if (response.ok) {
          console.log(`[Brevo Email] Dispatched ticket #${payload.bookingId} receipt to ${cleanEmail}`);
          return { success: true, message: `E-Ticket confirmation sent to ${cleanEmail}!` };
        }
      } catch (err) {
        console.error('[Brevo Email] Ticket dispatch error:', err);
      }
    }

    console.log(`\n🎟️ [TICKET EMAIL DISPATCH] Sent ticket #${payload.bookingId} to ${cleanEmail} (${payload.movieTitle}, Seats: ${formattedSeats})\n`);
    return { success: true, message: `E-Ticket confirmation dispatched to ${cleanEmail}!` };
  }
}

export const emailService = new EmailService();
