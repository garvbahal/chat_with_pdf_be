export const getMailHTMLTemplate = (otp: string) => {
    return `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 40px 0;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; text-align: center; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
    
    <h2 style="color: #333;">🔐 Verify Your Email</h2>
    
    <p style="color: #555; font-size: 14px;">
      Use the OTP below to complete your signup process.
    </p>

    <div style="margin: 30px 0;">
      <span style="
        display: inline-block;
        font-size: 32px;
        letter-spacing: 8px;
        font-weight: bold;
        color: #ffffff;
        background: #4f46e5;
        padding: 12px 24px;
        border-radius: 8px;
      ">
        ${otp}
      </span>
    </div>

    <p style="color: #777; font-size: 13px;">
      This OTP is valid for <strong>5 minutes</strong>.
    </p>

    <p style="color: #999; font-size: 12px; margin-top: 20px;">
      If you did not request this, you can safely ignore this email.
    </p>

  </div>

  <p style="text-align:center; font-size:12px; color:#aaa; margin-top:20px;">
    © ${new Date().getFullYear()} Chat-with-pdf. All rights reserved.
  </p>
</div>
`;
};
