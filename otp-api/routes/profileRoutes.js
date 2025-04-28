// profileRoutes.js
const express = require('express');
const router = express.Router();
const Profile = require('../models/profileModel');  // Import the Profile model

// Save user profile
router.post('/profile', async (req, res) => {
    const { name, phone, department } = req.body;

    try {
        // Check if a profile with this phone already exists
        let profile = await Profile.findOne({ phone });

        if (profile) {
            // If profile exists, update it
            profile.name = name;
            profile.department = department;
            await profile.save();
            res.status(200).json(profile);
        } else {
            // If profile doesn't exist, create a new one
            profile = new Profile({ name, phone, department });
            await profile.save();
            res.status(201).json(profile);
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Fetch user profile
router.get('/profile/:phone', async (req, res) => {
    const { phone } = req.params;

    try {
        const profile = await Profile.findOne({ phone });

        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
