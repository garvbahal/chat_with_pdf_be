import nodemailer from "nodemailer";

export async function sendMail(sendTo: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_GMAIL,
      pass: process.env.USER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER_GMAIL,
    to: sendTo,
    subject: subject,
    html: text,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending mail: ", error);
  }
}
