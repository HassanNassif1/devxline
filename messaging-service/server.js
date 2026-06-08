const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const sequelize = require('./config/database');
const reviewsRouter = require('./routes/reviews');
const Appointment = require('./models/Appointment');
require("dotenv").config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());
app.use('/api', reviewsRouter);

// Log environment variables for debugging
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "EXISTS" : "MISSING");

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// Fetch data from models


// Configure NodeMailer Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // 587 for STARTTLS
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Avoid TLS-related issues
  },
});
const moment = require('moment');
const ics = require('ics');

app.post('/create-appointment', async (req, res) => {
  const { name, email, appointmentDate, message } = req.body;

  if (!name || !email || !appointmentDate) {
    return res.status(400).json({ message: "Name, email, and appointmentDate are required." });
  }

  try {
    // Convert frontend datetime string into separate date and time for Sequelize
    const momentDate = moment(appointmentDate);
    const date = momentDate.format('YYYY-MM-DD');      // DATE field
    const time = momentDate.format('HH:mm:ss');        // TIME field
    const formattedDate = momentDate.format('dddd, MMMM Do YYYY, h:mm A'); // For emails

    // Save appointment to the database
    const newAppointment = await Appointment.create({
      name,
      email,
      date,
      time,
      message,
    });

    // --- Email transporter for user ---
    const userTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    // User email without ICS
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Appointment Confirmation',
      text: `Your appointment has been scheduled for ${formattedDate}.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 5px; max-width: 600px;">
          <h2 style="color: #333;">Your Appointment Confirmation</h2>
          <p>Dear ${name},</p>
          <p>We’ve successfully scheduled your appointment for <strong>${formattedDate}</strong>.</p>
          <p><strong>Message:</strong> ${message}</p>
          <p>We look forward to meeting you!</p>
        </div>
      `,
    };

    await userTransporter.sendMail(userMailOptions);

    // --- Generate ICS calendar file ---
    const event = {
      start: [momentDate.year(), momentDate.month() + 1, momentDate.date(), momentDate.hour(), momentDate.minute()],
      duration: { hours: 1, minutes: 0 },
      title: `Appointment with ${name}`,
      description: message,
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: { name: 'Your Company', email: process.env.EMAIL_USER },
      attendees: [{ name: name, email: email }],
    };

    ics.createEvent(event, async (error, value) => {
      if (error) console.error('Error creating calendar event:', error);

      // Send ICS attachment
      const userMailOptionsWithIcs = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Appointment Confirmation with Calendar',
        text: `Your appointment has been scheduled for ${formattedDate}. Please see the attached calendar invite.`,
        attachments: [
          { filename: 'appointment.ics', content: value },
        ],
      };

      await userTransporter.sendMail(userMailOptionsWithIcs);
    });

    // --- Email to admin ---
    const adminTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });

    const adminMailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Appointment Request for ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nAppointment Date: ${formattedDate}`,
      html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 5px; max-width: 600px;">
          <h2 style="color: #333;">📩 New Appointment Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #1a73e8;">${email}</a></p>
          <p><strong>Message:</strong></p>
          <p style="background: #f4f4f4; padding: 10px; border-radius: 5px; border-left: 4px solid #1a73e8;">
            ${message}
          </p>
          <p><strong>Appointment Date:</strong> ${formattedDate}</p>
          <hr>
          <p style="color: #888; font-size: 12px;">This message was sent from your website's contact form.</p>
        </div>
      `,
    };

    await adminTransporter.sendMail(adminMailOptions);

    res.status(200).json({
      message: 'Appointment created successfully and confirmation email sent!',
      appointment: newAppointment,
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment' });
  }
});




// Email Sending Route
app.post("/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Send email to your email address (the website owner)
    await transporter.sendMail({
      from: `"${name}" <${email}>`, // Sender's name and email
      to: process.env.EMAIL_USER, // Your email where you receive messages
      subject: `New Contact Form Submission from ${name}`, // Clear and professional subject
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Fallback text version
      html: ` 
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 5px; max-width: 600px;">
          <h2 style="color: #333;">📩 New Contact Form Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #1a73e8;">${email}</a></p>
          <p><strong>Message:</strong></p>
          <p style="background: #f4f4f4; padding: 10px; border-radius: 5px; border-left: 4px solid #1a73e8;">
            ${message}
          </p>
          <hr>
          <p style="color: #888; font-size: 12px;">This message was sent from your website's contact form.</p>
        </div>
      `,
    });

    // Send confirmation email to the sender
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Your email
      to: email, // Sender's email
      subject: "We’ve Received Your Message – Thank You!", // Subject of the confirmation email
      text: "Thank you for reaching out! We’ve received your message and will get back to you within 7 business days. If it's urgent, feel free to contact us again.",
      html: ` 
        <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 5px; max-width: 600px;">
          <h2 style="color: #333;">Thank You for Contacting Us!</h2>
          <p>Dear ${name},</p>
          <p>We’ve received your message and will get back to you within 10 business days. If it’s urgent, feel free to contact us again.</p>
          <p>Best regards,<br>Your Team at CoDevelop</p>
        </div>
      `,
    });

    res.status(200).json({ message: "✅ Message sent successfully and confirmation email sent!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Error sending message" });
  }
});
