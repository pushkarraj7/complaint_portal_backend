const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    name: String,
    phone: String,
    department: String,
    issueType: String,
    description: String,
    submittedOn: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: 'Pending',  // Default status is 'pending'
    },
    assignedStaff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',  // Reference to the Staff model
        default: null, // No staff assigned by default
    },
});

module.exports = mongoose.model('Issue', issueSchema);
