import nodemailer from 'nodemailer';

// Create nodemailer transporter
let transporter;

// Initialize transporter based on environment
if (process.env.NODE_ENV === 'production') {
  // Production transporter (e.g., SendGrid, AWS SES, etc.)
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g. 'SendGrid'
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  // Development transporter (e.g., Ethereal or local SMTP)
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

// Test the transporter connection
transporter.verify((error) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server connection established');
  }
});

// Function to send email
const sendEmail = async ({ to, subject, html, from }) => {
  try {
    const mailOptions = {
      from: from || process.env.EMAIL_FROM || 'noreply@emailmarketingapp.com',
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default {
  sendEmail,
  transporter,
};