import Agenda from 'agenda';
import mongoose from 'mongoose';
import sendEmail from '../email/index.js';
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
    const email = await Email.findById(emailId);

    if (!email || email.sent || email.cancelled) {
      console.log(`Email ${emailId} skipped: already sent, cancelled, or not found`);
      return;
    }

    await sendEmail({
      to: email.to,
      subject: email.subject,
      html: email.body,
      from: email.from
    });

    email.sent = true;
    email.sentAt = new Date();
    await email.save();

    console.log(`Email ${emailId} sent successfully`);
  } catch (error) {
    console.error(`Error sending email ${emailId}:`, error);
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

// ✅ Default and named exports
export default startAgenda;
export { agenda, scheduleEmail };
