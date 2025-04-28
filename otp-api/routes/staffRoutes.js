const express = require('express');
const bcrypt = require('bcryptjs');
const Staff = require('../models/staffModel');

const router = express.Router();

// Create new staff
router.post('/create', async (req, res) => {
  try {
    const { name, email, department, password } = req.body;

    // Check if staff already exists
    const staffExists = await Staff.findOne({ email });
    if (staffExists) {
      return res.status(400).json({ message: 'Staff already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new staff member
    const newStaff = new Staff({ name, email, department, password: hashedPassword });
    await newStaff.save();

    res.status(201).json({ message: 'Staff created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Staff Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        department: staff.department
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get all staff members
router.get('/all', async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.status(200).json(staffList);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get staff by ID
router.get('/staff/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
