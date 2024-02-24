import nodemailer from "nodemailer";
const sendEmail = async ({
  to,
  cc,
  bcc,
  subject,
  text,
  html,
  attachments = [],
} = {}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Ahmed Elassal 🐣" ${process.env.GMAIL}`, // sender address
    to,
    subject,
    text,
    html,
    attachments,
  });
  return info?.rejected?.length ? false : true;
};
export default sendEmail;
