import dotenv from "dotenv";
import { Resend } from "resend";
dotenv.config();

const resend_api = process.env.RESEND_APIKEY;
if (!resend_api) {
  throw new Error("resend api missing");
}

export async function sendMail(sendTo: string, subject: string, html: string) {
  const resend = new Resend(resend_api);

  const mailOptions = {
    from: "onboarding@resend.dev",
    to: sendTo,
    subject: subject,
    html: html,
  };
  try {
    await resend.emails.send(mailOptions);
  } catch (error) {
    console.log("Error sending mail: ", error);
  }
}
