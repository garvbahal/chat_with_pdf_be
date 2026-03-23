export const getWelcomeEmailTemplate = (email: string) => `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 40px 0;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">

    <h1 style="color: #4f46e5; margin-bottom: 10px;">
      🎉 Welcome!
    </h1>

    <p style="color: #333; font-size: 16px;">
      Your account has been successfully created.
    </p>

    <p style="color: #555; font-size: 14px; margin-top: 10px;">
      You're now ready to explore the platform.
    </p>

    <div style="margin: 25px 0;">
      <p style="font-size: 13px; color: #888;">Registered Email:</p>
      <p style="font-size: 15px; font-weight: bold; color: #222;">
        ${email}
      </p>
    </div>

    <a href="#" style="
      display: inline-block;
      background: #4f46e5;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 14px;
      margin-top: 10px;
    ">
      Go to Dashboard
    </a>

    <p style="color: #999; font-size: 12px; margin-top: 25px;">
      If you did not create this account, please contact support immediately.
    </p>

  </div>

  <p style="text-align:center; font-size:12px; color:#aaa; margin-top:20px;">
    © ${new Date().getFullYear()} Your App. All rights reserved.
  </p>
</div>
`;
