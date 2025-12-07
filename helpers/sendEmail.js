import nodemailer from "nodemailer";
import "dotenv/config";

const {
  MAIL_SERVER,
  MAIL_PORT,
  MAIL_SSL_TLS,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM,
} = process.env;

const transporter = nodemailer.createTransport({
  host: MAIL_SERVER,
  port: MAIL_PORT,
  secure: MAIL_SSL_TLS === "True",
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD,
  },
});

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: MAIL_FROM,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}

export default sendEmail;
