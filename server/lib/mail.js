const nodemailer = require("nodemailer");
const { generateWelcomeEmailHTML, generateWelcomeEmailText } = require('../utils/emailTemplates/welcomeEmail');
const { generatePasswordResetEmailHTML, generatePasswordResetEmailText } = require('../utils/emailTemplates/passwordResetEmail');
const { generateVerificationEmailHTML, generateVerificationEmailText } = require('../utils/emailTemplates/verificationEmail');

// Professional transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // App password, not regular password
  },
  // Professional settings
  pool: true,
  maxConnections: 1,
  rateDelta: 20000, // 20s delay between emails
  headers: {
    "X-Application": "UniSportX",
    "List-Unsubscribe": `<mailto:unsubscribe@unisportx.com?subject=Unsubscribe>`,
  },
  tls: {
    rejectUnauthorized: false,
  },
//   secure: true
});

async function sendWelcomeEmail(userEmail, userName) {
  try {
    const videosUrl = process.env.CLIENT_URL || 'http://localhost:3000/videos';
    
    const mailOptions = {
      from: `"UniSportX" <${process.env.GMAIL_USER}>`,
      replyTo: '"Support Team" <support@unisportx.com>',
      to: userEmail,
      subject: "Welcome to UniSportX! 🎉",
      html: generateWelcomeEmailHTML(userName, videosUrl),
      text: generateWelcomeEmailText(userName, videosUrl),
      headers: {
        "X-Priority": "3",
        "X-Mailer": "UniSportX",
      },
    };
    
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully to:", userEmail);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
}

async function sendPasswordResetEmail(email, resetToken, username, resetUrl) {
  try {
    const mailOptions = {
      from: `"UniSportX" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - UniSportX",
      html: generatePasswordResetEmailHTML(username, resetUrl),
      text: generatePasswordResetEmailText(username, resetUrl),
      headers: {
        "X-Priority": "1",
        "X-Mailer": "UniSportX",
      },
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
}

async function sendVerificationEmail(email, verificationToken, username) {
  try {
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
    
    const mailOptions = {
      from: `"UniSportX" <${process.env.GMAIL_USER}>`,
      replyTo: '"Support Team" <support@unisportx.com>',
      to: email,
      subject: "Verify Your Email - UniSportX",
      html: generateVerificationEmailHTML(username, verificationUrl),
      text: generateVerificationEmailText(username, verificationUrl),
      headers: {
        "X-Priority": "1",
        "X-Mailer": "UniSportX",
      },
    };
    
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
}

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
};
