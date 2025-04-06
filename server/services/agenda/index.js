import Agenda from 'agenda';
import mongoose from 'mongoose';
import  sendEmail  from '../email/index.js';
import Email from '../../models/email.model.js';

// Create agenda instance
const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    collection: 'agendaJobs',
    options: { useUnifiedTopology: true }
  },
  processEvery: '1 minute'
});

// Define email sending job
agenda.define('send email', async (job) => {
  const { emailId } = job.attrs.data;
  
  try {
    // Find email by ID
    const email = await Email.findById(emailId);
    
    // Check if email exists and hasn't been sent yet
    if (!email || email.sent || email.cancelled) {
      console.log(`Email ${emailId} skipped: already sent, cancelled, or not found`);
      return;
    }
    
    // Send email
    await sendEmail({
      to: email.to,
      subject: email.subject,
      html: email.body,
      from: email.from
    });
    
    // Update email status
    email.sent = true;
    email.sentAt = new Date();
    await email.save();
    
    console.log(`Email ${emailId} sent successfully`);
  } catch (error) {
    console.error(`Error sending email ${emailId}:`, error);
    
    // Retry logic could be implemented here
    // For now, we'll just log the error
  }
});

// Function to schedule an email
const scheduleEmail = async ({ emailId, scheduledFor }) => {
  try {
    await agenda.schedule(scheduledFor, 'send email', { emailId });
    console.log(`Email ${emailId} scheduled for ${scheduledFor}`);
    return true;
  } catch (error) {
    console.error('Error scheduling email:', error);
    throw error;
  }
};

// Start agenda
const startAgenda = async () => {
  await agenda.start();
  console.log('Agenda started');
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  await agenda.stop();
  process.exit(0);
});

export  default {
  agenda,
  startAgenda,
  scheduleEmail
};