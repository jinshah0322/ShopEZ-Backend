require("express-async-errors")
const nodemailer = require("nodemailer")

const sendEmail = async (data, req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASSWORD
        }
    });

    async function main() {
        const info = await transporter.sendMail({
            from: process.env.MAIL_ID,
            to: data.to, 
            subject: data.subject, // Subject line
            text: data.text, // plain text body
            html: data.html, // html body
        });
        console.log("Message sent: %s", info.messageId);
    }

    main().catch(console.error);
}

module.exports = sendEmail