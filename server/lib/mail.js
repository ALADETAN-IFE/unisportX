const { sendEmail } = require('../config/brevo');
require('dotenv').config();
const { generateWelcomeEmailHTML, generateWelcomeEmailText } = require('../utils/emailTemplates/welcomeEmail');
const { generatePasswordResetEmailHTML, generatePasswordResetEmailText } = require('../utils/emailTemplates/passwordResetEmail');
const { generateVerificationEmailHTML, generateVerificationEmailText } = require('../utils/emailTemplates/verificationEmail');


async function sendWelcomeEmail(email, userName) {
    const videosUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/app/videos'`;
    
    const subject = "Welcome to UniSportX! 🎉";
    const htmlContent = await generateWelcomeEmailText(userName, videosUrl);
    const textContent = await generateWelcomeEmailHTML(userName, videosUrl);

    return sendEmail(email, subject, htmlContent, textContent);
}
  
async function sendPasswordResetEmail(email, username, resetUrl) {
    const subject = "Reset Your Password - UniSportX";
    const htmlContent = await  generatePasswordResetEmailHTML(username, resetUrl);
    const textContent = await generatePasswordResetEmailText(username, resetUrl);
  
    return sendEmail(email, subject, htmlContent, textContent);
}
  
async function sendVerificationEmail(email, verificationToken, username) {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
  
  const subject = "Verify Your Email - UniSportX";
  const htmlContent = await generateVerificationEmailHTML(username, verificationUrl);
  const textContent = await generateVerificationEmailText(username, verificationUrl);

  return sendEmail(email, subject, htmlContent, textContent);

}

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
};
