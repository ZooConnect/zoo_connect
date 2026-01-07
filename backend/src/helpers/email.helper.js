import nodemailer from 'nodemailer';

const createTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port) {
        console.warn('SMTP not configured (SMTP_HOST/SMTP_PORT missing). Emails will be logged only.');
        return null;
    }

    const transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465, // true for 465, false for other ports
        auth: user && pass ? { user, pass } : undefined
    });

    return transporter;
};

const transporter = createTransporter();

export const sendEmail = async ({ to, subject, text, html, from }) => {
    const fromAddress = from || process.env.FROM_EMAIL || 'no-reply@zoo-connect.local';

    if (!transporter) {
        console.log('[email] SMTP not configured. Email content:');
        console.log('From:', fromAddress);
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Text:', text);
        console.log('HTML:', html);
        return;
    }

    try {
        const info = await transporter.sendMail({ from: fromAddress, to, subject, text, html });
        console.log('[email] Sent:', info.messageId);
    } catch (err) {
        console.error('[email] Failed to send email:', err);
    }
};

export default { sendEmail };
