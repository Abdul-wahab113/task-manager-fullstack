import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.mailtrap.io",
    port: process.env.SMTP_PORT || 2525,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: '"Tasker Security" <noreply@tasker.com>',
        to: email,
        subject: "Tasker - Password Reset Request",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h2 style="color: #10b981; text-align: center;">Tasker Password Reset</h2>
                <p>Hello,</p>
                <p>You requested to reset your password. Please click the button below to set a new password.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                </div>
                <p style="color: #6b7280; font-size: 0.9em;">This link will expire in 15 minutes.</p>
                <p style="color: #6b7280; font-size: 0.9em;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};
