require('dotenv').config();  // Load environment variables first
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('./db');  // DB connection
const Otp = require('./models/otpModel');  // OTP model
const issueRoutes = require('./routes/issueRoutes'); // Import issue routes
const profileRoutes = require('./routes/profileRoutes'); // Import profile routes
const staffRoutes = require('./routes/staffRoutes'); // 🔥 Added staff routes

const app = express();
app.use(cors());
app.use(express.json());

// Use issue routes
app.use('/api', issueRoutes);

// Use profile routes
app.use('/api', profileRoutes);

// Use staff routes
app.use('/api/staff', staffRoutes); // 🔥 New line to handle staff APIs

// Send OTP route
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Complaint Portal',
html: `
    <div style="background-color: #e8f0fe; padding: 50px 0; min-height: 50vh; font-family: Arial, sans-serif; text-align: center;">
    <div style="background-color: white; max-width: 500px; margin: auto; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="margin-bottom: 20px;">
            <div style="background-color: #e8f0fe; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: auto;">
                <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="Lock Icon" style="width: 48px; height: 48px; display: block; margin: auto;" />
            </div>
        </div>
        <h2 style="color: #3b82f6; margin-bottom: 10px;">OTP</h2>
        <p style="color: #555; margin: 0 0 20px;">Hey, here is your OTP for Login into <strong>Complaint Portal</strong>.</p>
        <p style="color: #555; margin-bottom: 30px;">Let's get you started!</p>
        <div style="font-size: 32px; font-weight: bold; color: #3b82f6; margin-bottom: 30px;">${otp}</div>
        <p style="color: #888; font-size: 14px;">Didn't request for OTP? You can ignore this message.</p>
    </div>
</div>

`

    };

    try {
        await transporter.sendMail(mailOptions);

        const existingOtp = await Otp.findOne({ email });
        if (existingOtp) {
            existingOtp.otp = otp;
            existingOtp.createdAt = new Date();
            await existingOtp.save();
        } else {
            await Otp.create({ email, otp });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
    }
});

// Verify OTP route
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const record = await Otp.findOne({ email, otp });
        if (record) {
            res.json({ success: true, message: 'OTP verified successfully!' });
        } else {
            res.json({ success: false, message: 'Invalid or expired OTP.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Verification failed.', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
