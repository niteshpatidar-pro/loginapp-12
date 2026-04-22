const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"CBRE Auth" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;">
                <h2 style="color: #006A4D; text-align: center;">CBRE Authentication</h2>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p>Hello,</p>
                <p>${options.message}</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; color: #006A4D; letter-spacing: 5px; background: #f4f4f4; padding: 10px 20px; border-radius: 5px;">
                        ${options.otp}
                    </span>
                </div>
                <p>This code expires in 5 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #777; text-align: center;">CBRE Corporate Security Team</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
