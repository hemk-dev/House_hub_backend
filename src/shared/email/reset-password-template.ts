// src/shared/utils/email-template.utility.ts

export const passwordResetEmailTemplate = (otp: string): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
        }
        .otp-box {
            background-color: #FF2400;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            display: inline-block;
            font-size: 24px;
            margin: 20px 0px;
        }
        .footer {
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
        .highlight {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Please use the following OTP to complete the process:</p>
        <div class="otp-box">
            ${otp}
        </div>
        <p>If you did not request this, you can safely ignore this email.</p>
        <div class="footer">
            <p><span class="highlight">Important:</span> Only someone with access to your email can reset your password. Make sure to keep your email secure.</p>
        </div>
    </div>
</body>
</html>
    `;
};
