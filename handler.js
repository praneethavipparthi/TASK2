const nodemailer = require('nodemailer');

module.exports.sendEmail = async (event) => {
    try {
        const { receiver_email, subject, body_text } = JSON.parse(event.body);

        if (!receiver_email || !subject || !body_text) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing required fields" }),
            };
        }

        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        const info = await transporter.sendMail({
            from: '"Serverless Email" <noreply@example.com>',
            to: receiver_email,
            subject: subject,
            text: body_text,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Email sent successfully",
                previewUrl: nodemailer.getTestMessageUrl(info),
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error sending email", error: error.message }),
        };
    }
};
