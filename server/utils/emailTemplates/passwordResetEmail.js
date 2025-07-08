const styles = {
  body: "margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;",
  outerPadding: "padding: 20px 0;",
  container: "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);",
  header: "background: #6D28D9; padding: 20px; text-align: center;",
  logoContainer: 'text-align: center; padding-bottom: 15px;',
  logo: 'max-width: 150px; height: auto;',
  title: "color: #ffffff; font-size: 24px; margin: 0; font-weight: 600;",
  content: "padding: 25px; background: #ffffff;",
  paragraph: "margin: 0 0 16px 0; font-size: 16px; line-height: 1.5; color: #333333;",
  warningBox: "margin: 0 0 20px 0; background-color: #f8f9fa; border-left: 4px solid #6D28D9;",
  warningBoxInner: "padding: 12px 15px;",
  warningText: "margin: 0; font-size: 14px; color: #6B7280; font-weight: 500;",
  button: "display: inline-block; padding: 12px 30px; background: #6D28D9; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; margin: 10px 0 20px 0;",
  secondaryParagraph:"margin: 0; font-size: 14px; line-height: 1.5; color: #666666;",
  url: "margin: 10px 0 0 0; font-size: 14px; line-height: 1.5; word-break: break-all; color: #6D28D9;",
  securityMessage: "margin: 20px 0 0 0; font-size: 14px; line-height: 1.5; color: #6B7280;",
  footer: "padding: 20px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;",
  footerText: "margin: 0 0 8px 0; font-size: 12px; color: #6B7280;",
  copyright: "margin: 0; font-size: 12px; color: #6B7280;",
};

function generatePasswordResetEmailHTML(username, resetUrl) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="${styles.body}">
  <!-- Outer Table (For Outlook) -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
  <td align="center" style="${styles.outerPadding}">
  <!-- Email Container -->
  <table width="600" cellpadding="0" cellspacing="0" style="${styles.container}">
    <!-- Header -->
    <tr>
      <td style="${styles.header}">
        <div style="${styles.logoContainer}">
          <h1 style="${styles.title}">UniSportX</h1>
        </div>
        <h1 style="${styles.title}">Password Reset 🔐</h1>
      </td>
    </tr>
    <!-- Content -->
    <tr>
      <td style="${styles.content}">
        <p style="${styles.paragraph}">Hello ${username},</p>
        <p style="${styles.paragraph}">You recently requested to reset your password for your UniSportX account. Click the button below to proceed.</p>
        
        <!-- Warning Box -->
        <table width="100%" cellpadding="0" cellspacing="0" style="${styles.warningBox}">
          <tr>
            <td style="${styles.warningBoxInner}">
              <p style="${styles.warningText}">This link will expire in <strong>1 hour</strong>. If you didn't request this change, you can safely ignore this email.</p>
            </td>
          </tr>
        </table>
  
        <!-- Button -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <a href="${resetUrl}" style="${styles.button}">Reset Password</a>
            </td>
          </tr>
        </table>
  
        <p style="${styles.secondaryParagraph}">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="${styles.url}">${resetUrl}</p>
        
        <!-- Security Message -->
        <p style="${styles.securityMessage}">
          If you didn't request this password reset, you can safely ignore this email. 
          Your account security is important to us.
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="${styles.footer}">
        <p style="${styles.footerText}">UniSportX Security Team</p>
        <p style="${styles.copyright}">© ${new Date().getFullYear()} UniSportX. All rights reserved.</p>
      </td>
    </tr>
  </table>
  </td>
  </tr>
  </table>
  </body>
  </html>
  `;
}

function generatePasswordResetEmailText(username, resetUrl) {
  return `
  UniSportX Password Reset\n\n
  
  Hello ${username},\n\n
  
  We received a request to reset your password. Click the link below (expires in 1 hour):\n\n
  
  ${resetUrl}\n\n
  
  For security reasons:\n
  - Do not share this link with anyone\n
  - The link will expire after 60 minutes\n
  - If you didn't request this, please ignore this email\n\n
  
  Need help? Contact our support team.\n\n
  
  © ${new Date().getFullYear()} UniSportX. All rights reserved.
  `;
}

module.exports = {
  generatePasswordResetEmailHTML,
  generatePasswordResetEmailText,
  styles
}; 