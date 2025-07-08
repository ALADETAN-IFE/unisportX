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

const WelcomeStyles = {
  container: 'font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; color: #1f2937; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);',
  header: 'text-align: center; padding: 25px 0; background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); border-radius: 8px 8px 0 0; margin-bottom: 20px;',
  logoContainer: 'text-align: center; padding-bottom: 10px;',
  logo: 'width: 100px; height: 100px; border-radius: 50%; object-fit: contain; border: 2px solid #ffffff; display: block; margin: 0 auto;',
  title: 'color: #ffffff; font-size: 28px; font-weight: 600; margin: 0;',
  content: 'padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;',
  paragraph: 'font-size: 16px; line-height: 1.6; margin-bottom: 20px;',
  sectionTitle: 'color: #4B5563; font-size: 20px; margin: 25px 0 15px; border-bottom: 2px solid #E5E7EB; padding-bottom: 5px;',
  list: 'list-style-type: none; padding: 0; margin: 20px 0;',
  listItem: 'padding: 12px 0; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center;',
  listItemIcon: 'color: #8B5CF6; margin-right: 15px; font-size: 20px;',
  button: 'display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; text-align: center; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);',
  image: 'max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;',
  footer: 'text-align: center; padding: 25px; color: #6B7280; font-size: 14px; border-top: 1px solid #E5E7EB; margin-top: 20px;',
};

const hosted_Logo = "http://res.cloudinary.com/dserpv6p5/image/upload/v1750828847/elkerqp2puqenfu1b5bi.png";

function generateWelcomeEmailHTML(userName, videosUrl) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="${styles.body}">
  <div style="${WelcomeStyles.container}">
  <!-- Header with Round Logo -->
  <div style="${styles.header}">
  <div style="${WelcomeStyles.logoContainer}">
    <img src="${hosted_Logo}" alt="UniSportX logo" style="${WelcomeStyles.logo}" />
  </div>
  <h1 style="${WelcomeStyles.title}">Welcome to UniSportX! 🎉</h1>
  </div>
  
  <div style="${WelcomeStyles.content}">
  <p style="${WelcomeStyles.paragraph}">Hi ${userName},</p>
  <p style="${WelcomeStyles.paragraph}">Thank you for joining UniSportX! We're excited to have you as part of our community.</p>
  
  <h2 style="${WelcomeStyles.sectionTitle}">What You Can Do:</h2>
  <ul style="${WelcomeStyles.list}">
    <li style="${WelcomeStyles.listItem}">
      <span style="${WelcomeStyles.listItemIcon}">📝</span>
      Upload and share sports videos
    </li>
    <li style="${WelcomeStyles.listItem}">
      <span style="${WelcomeStyles.listItemIcon}">🎯</span>
      Connect with other athletes
    </li>
    <li style="${WelcomeStyles.listItem}">
      <span style="${WelcomeStyles.listItemIcon}">📊</span>
      Track your sports journey
    </li>
    <li style="${WelcomeStyles.listItem}">
      <span style="${WelcomeStyles.listItemIcon}">🤝</span>
      Join the sports community
    </li>
  </ul>
  
  <div style="text-align: center;">
    <a href="${videosUrl}" style="${WelcomeStyles.button}">
      Start Your Journey
    </a>
  </div>
  
  <p style="${styles.paragraph}">Need help? Contact us at support@unisportx.com</p>
  </div>
  
  <div style="${styles.footer}">
  <p>Best regards,<br>The UniSportX Team</p>
  <p style="${styles.copyright}">© ${new Date().getFullYear()} UniSportX</p>
  </div>
  </div>
  </body>
  </html>
  `;
}

function generateWelcomeEmailText(userName, videosUrl) {
  return `
  Welcome to UniSportX, ${userName}!
  \n\n
  Thank you for joining our community of athletes and sports enthusiasts. Here's what you can do:
  \n\n
  • Upload and share your sports videos\n
  • Connect with other athletes\n
  • Track your sports journey\n
  • Join the sports community\n
  \n
  Get started: ${videosUrl}\n\n
  
  Need help? Contact us at support@unisportx.vercel.app\n
  
  Best regards,\n
  The UniSportX Team\n\n
  
  © ${new Date().getFullYear()} UniSportX. All rights reserved.
  `;
}

module.exports = {
  generateWelcomeEmailHTML,
  generateWelcomeEmailText,
  styles,
  WelcomeStyles
}; 