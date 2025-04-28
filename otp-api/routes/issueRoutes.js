const express = require('express');
const router = express.Router();
const Issue = require('../models/issueModel');  // Import the Issue model
const Staff = require('../models/staffModel');  // Assuming you have a Staff model

// Create Issue
router.post('/issues', async (req, res) => {
    try {
        const newIssue = new Issue(req.body);
        await newIssue.save();
        res.status(201).json(newIssue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all Issues
router.get('/issues', async (req, res) => {
    try {
        const issues = await Issue.find();
        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Issue: Change status and assign staff
router.put('/issues/:id', async (req, res) => {
    const { status, assignedStaff } = req.body;

    try {
        // Ensure assigned staff exists if provided
        if (assignedStaff) {
            const staff = await Staff.findById(assignedStaff);
            if (!staff) {
                return res.status(404).json({ message: 'Staff member not found' });
            }
        }

        // Update the issue with new status and assigned staff
        const updatedIssue = await Issue.findByIdAndUpdate(
            req.params.id,
            { status, assignedStaff },
            { new: true }  // Return updated document
        );

        if (!updatedIssue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        res.status(200).json(updatedIssue);  // Return the updated issue
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
