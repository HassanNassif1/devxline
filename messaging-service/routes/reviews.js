const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

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
console.log(process.env.SMTP_USER, process.env.SMTP_PASS);

// Post a new review and send a thank-you email
router.post('/submit', async (req, res) => {
  const { name, email, rating, message } = req.body;

  try {
    // Save review in database
    const review = await Review.create({ name, email, rating, message });

    // Send thank-you email to the reviewer
    await transporter.sendMail({
      from: process.env.SMTP_USER, // Your email
      to: email, // Reviewer's email
      subject: "Thank You for Your Review! ⭐",
      text: `Hi ${name},\n\nThank you for leaving a review! Your feedback is valuable to us.\n\nBest Regards,\CoDevelop Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 5px; max-width: 600px;">
          <h2 style="color: #333;">Thank You for Your Review! ⭐</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>We appreciate your feedback and are thrilled that you took the time to share your experience.</p>
          <p>Your review:</p>
          <blockquote style="background: #f4f4f4; padding: 10px; border-left: 4px solid #1a73e8;">
            "${message}"
          </blockquote>
          <p>We value your thoughts and hope to see you again soon!</p>
          <p>Best regards,<br><strong>CoDevelop Team</strong></p>
        </div>
      `,
    });

    res.status(201).json({ message: 'Review submitted successfully and thank-you email sent!', review });
  } catch (error) {
    console.error("Error submitting review or sending email:", error);
    res.status(400).json({ error: 'Error submitting review or sending email' });
  }
});

// Get all reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.findAll({ order: [['createdAt', 'DESC']] });
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error fetching reviews' });
  }
});
router.post('/createReviews',async(req,res)=>{

  try{
    const { name, email, rating, message}=req.body;
const reviews=await Review.create({name,email,rating,message});
res.status(200).json(reviews);
  }catch (error){
    console.error(error);
  }
});


router.put('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, rating, message } = req.body;

    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    await review.update({ name, email, rating, message });

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

router.put('/updateReviews/:id',async(req,res)=>{
try{
  const {id}=req.params;
  const {name,email,rating,message}=req.body;
  const review=await Review.findByPk(id);
  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }
  await Review.update({name,email,rating,message},{where:{id}});
  const updatedReview=Review.findByPk(id);
  res.status(200).json(updatedReview);
} catch(error){
console.error(error)
}

});
module.exports = router;
