const axios = require('axios');
require('dotenv').config();

exports.sendEmail = async ( to, subject, htmlContent, textContent ) => {
    try {
        if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
            console.error('Brevo API key or sender email is not configured.');
            return false;
        }
        console.log(process.env.BREVO_API_KEY)
        console.log(process.env.BREVO_SENDER_EMAIL)

        const response = await axios({
            method: 'POST',
            url: 'https://api.brevo.com/v3/smtp/email',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            data: {
                sender: {
                    name: "UniSportX Team",
                    email: process.env.BREVO_SENDER_EMAIL
                },
                to: [{
                    email: to
                }],
                subject: subject,
                htmlContent: htmlContent,
                textContent: textContent
            }
        });

        console.log('Email sent successfully:', response.data);
        return true;
        } catch (error) {
          // Enhanced error logging
          if (error.code === 'ECONNRESET') {
            console.error('Connection reset error while sending email to:', to);
            console.error('This might be due to network issues or Brevo service being temporarily unavailable.');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('Timeout error while sending email to:', to);
        } else if (error.response) {
            // Server responded with error status
            console.error('Brevo API error:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });
        } else if (error.request) {
            // Request was made but no response received
            console.error('No response received from Brevo API:', error.message);
        } else {
            // Something else happened
            console.error('Error sending email:', error.message);
        }
        return false;
    }
};