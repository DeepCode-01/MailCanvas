import Email from '../models/email.model.js';
import  scheduleEmail from '../services/agenda/index.js';

const scheduleNewEmail = async (req, res) => {
  try {
    // Validate request body
    const { to, subject, body, scheduledFor } = req.body;
    
    if (!to || !subject || !body || !scheduledFor) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create new email document
    const newEmail = new Email({
      to,
      subject,
      body,
      scheduledFor: new Date(scheduledFor),
      from: process.env.EMAIL_FROM || 'noreply@emailmarketingapp.com',
      user: req.user._id,
      flow: req.body.flowId || null,
    });
    
    // Save email to database
    await newEmail.save();
    
    // Schedule email job with Agenda
    await scheduleEmail({
      emailId: newEmail._id,
      to,
      subject,
      body,
      scheduledFor: new Date(scheduledFor)
    });
    
    return res.status(201).json({
      message: 'Email scheduled successfully',
      email: newEmail
    });
  } catch (error) {
    console.error('Error scheduling email:', error);
    return res.status(500).json({ message: 'Error scheduling email' });
  }
};

const getScheduledEmails = async (req, res) => {
  try {
    const emails = await Email.find({ 
      user: req.user._id,
      sent: false,
      scheduledFor: { $gt: new Date() }
    }).sort({ scheduledFor: 1 });
    
    return res.status(200).json(emails);
  } catch (error) {
    console.error('Error fetching scheduled emails:', error);
    return res.status(500).json({ message: 'Error fetching scheduled emails' });
  }
};

const getSentEmails = async (req, res) => {
  try {
    const emails = await Email.find({ 
      user: req.user._id,
      sent: true
    }).sort({ sentAt: -1 });
    
    return res.status(200).json(emails);
  } catch (error) {
    console.error('Error fetching sent emails:', error);
    return res.status(500).json({ message: 'Error fetching sent emails' });
  }
};

const cancelScheduledEmail = async (req, res) => {
  try {
    const emailId = req.params.id;
    
    // Find and update the email
    const email = await Email.findOneAndUpdate(
      { _id: emailId, user: req.user._id, sent: false },
      { $set: { cancelled: true } },
      { new: true }
    );
    
    if (!email) {
      return res.status(404).json({ message: 'Email not found or already sent' });
    }
    
    // Cancel the scheduled job
    // This will be handled by checking the 'cancelled' field when the job runs
    
    return res.status(200).json({ 
      message: 'Email cancelled successfully',
      email
    });
  } catch (error) {
    console.error('Error cancelling email:', error);
    return res.status(500).json({ message: 'Error cancelling email' });
  }
};

export default {scheduleEmail,scheduleNewEmail,getScheduledEmails,getSentEmails,cancelScheduledEmail}