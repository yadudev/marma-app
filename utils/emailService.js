const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587, // Correct port for Gmail SMTP with TLS
  secure: false, // false for TLS port 587
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password or normal password (less secure apps must be enabled)
  },
});

/**
 * Send an email with the provided details
 * @param {object} mailOptions - The email details (to, subject, text, html)
 * @returns {Promise} - Resolves when the email is sent successfully
 */
const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
};

/**
 * Template for a password reset email
 * @param {string} resetUrl - The URL to reset the password
 * @param {string} userName - The user's name
 * @returns {string} - The HTML template for the password reset email
 */
const emailTemplates = {
  resetPassword: (resetUrl, userName) => {
    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              line-height: 1.5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .btn {
              background-color: #007bff;
              color: #fff;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 5px;
            }
            .footer {
              font-size: 12px;
              color: #777;
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Hello, ${userName}!</h2>
            <p>We received a request to reset your password. To reset it, click the link below:</p>
            <a href="${resetUrl}" class="btn">Reset Password</a>
            <p>If you didn't request this change, you can ignore this email.</p>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  welcomeEmail: (userName) => {
    return `
      <html>
        <body>
          <h2>Welcome to our platform, ${userName}!</h2>
          <p>Thank you for signing up. We are excited to have you on board.</p>
        </body>
      </html>
    `;
  },
};

module.exports = { sendEmail, emailTemplates };
