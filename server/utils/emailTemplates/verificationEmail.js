const generateVerificationEmailHTML = (username, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - UniSportX</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background-color: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .title {
          color: #1f2937;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background-color: #2563eb;
          color: #ffffff;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #1d4ed8;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .warning {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          color: #92400e;
        }
        .link {
          color: #2563eb;
          text-decoration: none;
        }
        .link:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">UniSportX</div>
          <h1 class="title">Verify Your Email Address</h1>
        </div>
        
        <div class="content">
          <p>Hi <strong>${username}</strong>,</p>
          
          <p>Welcome to UniSportX! 🎉 We're excited to have you join our community of university sports enthusiasts.</p>
          
          <p>To complete your registration and start sharing your sports content, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          
          <div class="warning">
            <strong>Important:</strong> This verification link will expire in 24 hours for security reasons.
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p><a href="${verificationUrl}" class="link">${verificationUrl}</a></p>
          
          <p>Once verified, you'll be able to:</p>
          <ul>
            <li>Upload and share your sports videos</li>
            <li>Connect with other university athletes</li>
            <li>Discover amazing sports content</li>
            <li>Build your sports community</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>If you didn't create an account with UniSportX, you can safely ignore this email.</p>
          <p>Need help? Contact us at <a href="mailto:support@unisportx.com" class="link">support@unisportx.com</a></p>
          <p>&copy; 2024 UniSportX. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateVerificationEmailText = (username, verificationUrl) => {
  return `
Verify Your Email Address - UniSportX

Hi ${username},

Welcome to UniSportX! 🎉 We're excited to have you join our community of university sports enthusiasts.

To complete your registration and start sharing your sports content, please verify your email address by visiting this link:

${verificationUrl}

IMPORTANT: This verification link will expire in 24 hours for security reasons.

Once verified, you'll be able to:
- Upload and share your sports videos
- Connect with other university athletes
- Discover amazing sports content
- Build your sports community

If you didn't create an account with UniSportX, you can safely ignore this email.

Need help? Contact us at support@unisportx.com

© 2024 UniSportX. All rights reserved.
  `;
};

module.exports = {
  generateVerificationEmailHTML,
  generateVerificationEmailText
}; 