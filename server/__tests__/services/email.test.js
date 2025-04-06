// server/__tests__/services/email.test.js
const { sendEmail, transporter } = require('../../services/email');

// Mock nodemailer transporter
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    verify: jest.fn((callback) => callback(null, true)),
    sendMail: jest.fn().mockImplementation((mailOptions) => {
      return Promise.resolve({
        messageId: 'mock-message-id',
        envelope: {
          from: mailOptions.from,
          to: [mailOptions.to]
        }
      });
    })
  })
}));

describe('Email Service', () => {
  const mockEmail = {
    to: 'recipient@example.com',
    subject: 'Test Email',
    html: '<p>This is a test email</p>',
    from: 'sender@example.com'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email successfully', async () => {
    const result = await sendEmail(mockEmail);
    
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: mockEmail.from,
      to: mockEmail.to,
      subject: mockEmail.subject,
      html: mockEmail.html
    });
    
    expect(result).toEqual({
      messageId: 'mock-message-id',
      envelope: {
        from: mockEmail.from,
        to: [mockEmail.to]
      }
    });
  });

  it('should use default from address if not provided', async () => {
    const { from, ...emailWithoutFrom } = mockEmail;
    process.env.EMAIL_FROM = 'default@example.com';
    
    await sendEmail(emailWithoutFrom);
    
    expect(transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'default@example.com'
      })
    );
  });

  it('should throw an error if email sending fails', async () => {
    // Mock error
    transporter.sendMail.mockImplementationOnce(() => {
      return Promise.reject(new Error('Failed to send email'));
    });
    
    await expect(sendEmail(mockEmail)).rejects.toThrow('Failed to send email');
  });
});