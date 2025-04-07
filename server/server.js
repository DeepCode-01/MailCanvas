const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Agenda = require("agenda");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173","https://mailcanvasbydeepali.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Agenda
const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    collection: "agendaJobs",
  },
});

// Define email job
agenda.define("send email", async (job) => {
  const { to, subject, text } = job.attrs.data;

  // Configure nodemailer
  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send email
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
});

// Start Agenda
(async function () {
  await agenda.start();
  console.log("Agenda started");
})();

// Import routes
const emailSequencesRouter = require("./routes/emailSequences");
const authRouter = require("./routes/auth");
const auth = require("./middleware/auth");

// Use routes
app.use("/api/auth", authRouter);
app.use("/api/sequences", auth, emailSequencesRouter);

// Protected route for scheduling emails
app.post("/api/schedule-email", auth, async (req, res) => {
  try {
    const { to, subject, text, scheduleTime } = req.body;

    // Schedule the email
    await agenda.schedule(scheduleTime, "send email", {
      to,
      subject,
      text,
    });

    res.json({ message: "Email scheduled successfully" });
  } catch (error) {
    console.error("Error scheduling email:", error);
    res.status(500).json({ error: "Failed to schedule email" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
