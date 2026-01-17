// @ts-ignore
import { SendMailClient } from "zeptomail";

const url = process.env.ZEPTOMAIL_URL || "https://api.zeptomail.com/v1.1/email";
const token = process.env.ZEPTOMAIL_TOKEN;

let client: any = null;

if (typeof window === "undefined") {
    client = new SendMailClient({ url, token });
}

export const sendConfirmationEmail = async (email: string, name: string) => {
    if (!client) {
        console.warn("ZeptoMail client not initialized (running on client-side?)");
        return;
    }

    const confirmationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/confirm?email=${encodeURIComponent(email)}`;

    try {
        await client.sendMail({
            "from": {
                "address": "noreply@kihumba.com",
                "name": "mov33"
            },
            "to": [
                {
                    "email_address": {
                        "address": email,
                        "name": name
                    }
                }
            ],
            "subject": "Welcome to mov33 - Confirm your email",
            "htmlbody": `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0A0A0A; color: #FFFFFF; border-radius: 12px; border: 1px solid #1A1A1A;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #E6B800; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -1px;">mov33</h1>
                    </div>
                    <h2 style="font-size: 20px; margin-bottom: 20px;">Welcome, ${name}!</h2>
                    <p style="color: #A1A1AA; line-height: 1.6; margin-bottom: 30px;">
                        Thank you for joining mov33. You're just one step away from exploring Kenya's most premium events and experiences. Please confirm your email address by clicking the button below.
                    </p>
                    <div style="text-align: center; margin-bottom: 30px;">
                        <a href="${confirmationLink}" style="background-color: #E6B800; color: #000000; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Confirm Email</a>
                    </div>
                    <p style="color: #52525B; font-size: 12px; text-align: center;">
                        If you didn't create an account with mov33, you can safely ignore this email.
                    </p>
                </div>
            `,
        });
        console.log(`Confirmation email sent to ${email}`);
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        throw error;
    }
};

export const sendPasswordResetEmail = async (email: string, name: string, resetLink: string) => {
    if (!client) {
        console.warn("ZeptoMail client not initialized (running on client-side?)");
        return;
    }

    try {
        await client.sendMail({
            "from": {
                "address": "noreply@kihumba.com",
                "name": "mov33"
            },
            "to": [
                {
                    "email_address": {
                        "address": email,
                        "name": name
                    }
                }
            ],
            "subject": "Reset your mov33 password",
            "htmlbody": `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0A0A0A; color: #FFFFFF; border-radius: 12px; border: 1px solid #1A1A1A;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #E6B800; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -1px;">mov33</h1>
                    </div>
                    <h2 style="font-size: 20px; margin-bottom: 20px;">Password Reset Request</h2>
                    <p style="color: #A1A1AA; line-height: 1.6; margin-bottom: 30px;">
                        Hello ${name}, we received a request to reset your password. Click the button below to set a new one. This link will expire in 1 hour.
                    </p>
                    <div style="text-align: center; margin-bottom: 30px;">
                        <a href="${resetLink}" style="background-color: #E6B800; color: #000000; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
                    </div>
                    <p style="color: #52525B; font-size: 12px; text-align: center;">
                        If you didn't request a password reset, you can safely ignore this email.
                    </p>
                </div>
            `,
        });
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
};
