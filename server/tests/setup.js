// Set test environment variables
process.env.JWT_SECRET = "test-secret-key";
process.env.MONGODB_URI = "mongodb://localhost:27017/email-marketing-test";
process.env.EMAIL_USER = "test@example.com";
process.env.EMAIL_PASS = "test-password";

// Increase timeout for tests
jest.setTimeout(30000);
