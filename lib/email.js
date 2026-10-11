import emailjs from '@emailjs/nodejs';

export async function sendOtpEmail(email, otp, purpose, expiresInMinutes) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    const error = new Error('EmailJS is not configured on the server.');
    error.statusCode = 503;
    throw error;
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: email,
        otp,
        code: otp,
        verification_code: otp,
        verificationCode: otp,
        passcode: otp,
        purpose: purpose === 'signup' ? 'verify your email address' : 'reset your password',
        expires_in_minutes: expiresInMinutes,
      },
      { publicKey, privateKey },
    );
  } catch (cause) {
    const error = new Error('EmailJS could not deliver the verification email.', { cause });
    error.statusCode = 502;
    throw error;
  }
}
