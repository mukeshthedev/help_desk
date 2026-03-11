const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  studentEmail: {
    type: String,
    required: [true, 'Student email is required'],
    trim: true,
    lowercase: true
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['CSE', 'ECE', 'Mechanical', 'Civil', 'MBA', 'BCA', 'SA', 'BCOM', 'MBBS', 'BE', 'Other']
  },
  issueCategory: {
    type: String,
    required: [true, 'Issue category is required'],
    enum: [
      'WiFi Not Working',
      'Lab System Issues',
      'Portal Login Errors',
      'Email Access Problems',
      'Software Installation',
      'Printer Issues',
      'Projector/AV Problems',
      'Other'
    ]
  },
  issueSummary: {
    type: String,
    required: [true, 'Issue summary is required'],
    trim: true
  },
  issueDescription: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  location: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  assignedTo: {
    type: String,
    default: null
  },
  resolutionNotes: {
    type: String,
    default: ''
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  emailSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Auto-generate ticket ID before saving
complaintSchema.pre('save', async function () {
  if (!this.ticketId) {
    const count = await mongoose.model('Complaint').countDocuments();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const number = String(count + 1).padStart(4, '0');
    this.ticketId = `TKT-${year}${month}-${number}`;
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);