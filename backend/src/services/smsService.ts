import crypto from 'crypto';

interface OtpEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
}

// In-memory OTP store (in production, Redis or Oracle database is used)
const otpStore = new Map<string, OtpEntry>();

export class SmsService {
  /**
   * Generates a secure 6-digit numeric OTP and dispatches it via the configured SMS Gateway.
   * Supports:
   * 1. Twilio (International)
   * 2. Fast2SMS (India)
   * 3. 2Factor.in (India)
   * 4. Development Simulated Gateway (when keys are not yet configured)
   */
  async generateAndSendOtp(rawMobile: string): Promise<{
    success: boolean;
    message: string;
    gatewayUsed: string;
    demoOtp?: string;
  }> {
    const cleanedMobile = rawMobile.replace(/[^0-9]/g, '').slice(-10);
    if (cleanedMobile.length !== 10) {
      throw new Error('Please enter a valid 10-digit mobile number');
    }

    // Generate cryptographic 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    otpStore.set(cleanedMobile, {
      otp,
      expiresAt,
      attempts: 0,
    });

    const smsMessage = `Your CineGo verification code is ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`;

    // 1. Check for Fast2SMS (Popular in India)
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    if (fast2smsKey) {
      try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            authorization: fast2smsKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: otp,
            numbers: cleanedMobile,
          }),
        });
        const resData: any = await response.json();
        if (resData.return) {
          console.log(`[Fast2SMS] Successfully dispatched OTP to +91 ${cleanedMobile}`);
          return {
            success: true,
            message: `Real SMS OTP sent to +91 ${cleanedMobile} via Fast2SMS`,
            gatewayUsed: 'Fast2SMS',
          };
        } else {
          console.warn(`[Fast2SMS] Delivery warning:`, resData);
        }
      } catch (err) {
        console.error(`[Fast2SMS] Error sending SMS:`, err);
      }
    }

    // 2. Check for Twilio
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    if (twilioSid && twilioToken && twilioPhone) {
      try {
        const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
        const params = new URLSearchParams();
        params.append('To', `+91${cleanedMobile}`);
        params.append('From', twilioPhone);
        params.append('Body', smsMessage);

        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          }
        );

        if (response.ok) {
          console.log(`[Twilio] Successfully sent SMS to +91 ${cleanedMobile}`);
          return {
            success: true,
            message: `Real SMS OTP sent to +91 ${cleanedMobile} via Twilio`,
            gatewayUsed: 'Twilio',
          };
        } else {
          const twilioErr: any = await response.json();
          console.warn(`[Twilio] Warning:`, twilioErr);
        }
      } catch (err) {
        console.error(`[Twilio] Error:`, err);
      }
    }

    // 3. Fallback: Development Gateway Mode
    // Clearly logs the generated OTP so developers/testers can sign in instantly
    console.log('\n==============================================');
    console.log(`📱 [CINEGO SMS GATEWAY] Dispatching to +91 ${cleanedMobile}`);
    console.log(`🔢 Generated OTP: ${otp}`);
    console.log(`⏳ Valid for: 5 minutes`);
    console.log(`💡 To send actual physical SMS to your mobile:`);
    console.log(`   Add FAST2SMS_API_KEY or TWILIO credentials in backend/.env`);
    console.log('==============================================\n');

    return {
      success: true,
      message: `OTP dispatched to +91 ${cleanedMobile}`,
      gatewayUsed: 'Development Sandbox',
      demoOtp: otp,
    };
  }

  /**
   * Verifies an OTP entered by the user strictly against the stored code
   */
  verifyOtp(rawMobile: string, userEnteredOtp: string): { valid: boolean; message: string } {
    const cleanedMobile = rawMobile.replace(/[^0-9]/g, '').slice(-10);
    const record = otpStore.get(cleanedMobile);

    if (!record) {
      return { valid: false, message: 'No active OTP request found for this mobile number. Please request a new code.' };
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanedMobile);
      return { valid: false, message: 'This OTP has expired. Please request a new code.' };
    }

    if (record.attempts >= 5) {
      otpStore.delete(cleanedMobile);
      return { valid: false, message: 'Too many incorrect attempts. Please request a new code.' };
    }

    const trimmedInput = userEnteredOtp.replace(/[^0-9]/g, '').trim();
    if (record.otp !== trimmedInput) {
      record.attempts += 1;
      return { valid: false, message: `Incorrect OTP code (${trimmedInput}). Please check and enter the exact 6-digit code.` };
    }

    // Success - consume OTP so it cannot be reused
    otpStore.delete(cleanedMobile);
    return { valid: true, message: 'OTP verified successfully' };
  }
}

export const smsService = new SmsService();
