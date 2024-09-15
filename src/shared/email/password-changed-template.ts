export const ChangedPasswordEmailTemplate = (
  updatedTime: string,
  user: string,
): string => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h2 {
      color: #333333;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .info-box {
      background-color: #ffe6e6;
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
    }
    .info-box p {
      margin: 0;
      padding: 5px 0;
      font-size: 14px;
      color: #000000;
    }
  </style>
</head>
<body>

  <div class="container">
    <h2>Password Changed</h2>
    <p>Hi, ${user}</p>
    <p>Your account password was successfully changed. If this change was made by you, no further action is needed. If you did not request this change, please secure your account immediately.</p>

    <div class="info-box">
      <p><strong>Changed At:</strong> ${updatedTime}</p>
    </div>

    <p>If you need assistance, feel free to reach out to our support team.</p>
  </div>

</body>
</html>
`;
};
