import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendMail(to, subject, text = null, html = null) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "brhmmuradov@gmail.com",
        pass: "bgrxlquyvnzjctlj",
      },
    });

    let info = await transporter.sendMail({
      from: '"Flicky Team" <brhmmuraddov@gmail.com>',
      to: to,
      subject: subject,
      text: text,
      html: html,
    });

    return info;
  } catch (err) {
    console.log(err);
  }
}

export const MakeHtml = (code) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Code</title>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Roboto', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 50px auto;
          background-color: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #ddd;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }
        .content {
          padding: 20px 0;
          text-align: center;
        }
        .content p {
          margin: 10px 0;
          font-size: 16px;
          color: #555;
        }
        .code-box {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          background-color: #007bff;
          border-radius: 5px;
          letter-spacing: 2px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Please use the following code to reset your password:</p>
          <div class="code-box">${code}</div>
        </div>
      </div>
    </body>
    </html>
  `;
};
