const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

const emailTemplates = {
  acknowledgment: (complaint) => ({
    subject: `[${complaint.ticketId}] Complaint Received - ${complaint.issueCategory}`,
    body: `Dear ${complaint.studentName},

Thank you for contacting the College Digital Support Team.

We have successfully received your complaint:

  Ticket ID    : ${complaint.ticketId}
  Issue        : ${complaint.issueCategory}
  Priority     : ${complaint.priority}
  Submitted On : ${new Date(complaint.createdAt).toLocaleString()}

Response times:
  Critical : 2 hours
  High     : 4 hours
  Medium   : 24 hours
  Low      : 48 hours

Track your complaint at: helpdesk.college.edu

We apologize for any inconvenience caused.

Warm regards,
Digital Support Team
College IT Helpdesk
📧 support@college.edu | 📞 +91-XXXXXXXXXX`
  }),

  inProgress: (complaint) => ({
    subject: `[${complaint.ticketId}] Update: Your Issue is Being Investigated`,
    body: `Dear ${complaint.studentName},

This is an update regarding your support request.

  Ticket ID   : ${complaint.ticketId}
  Issue       : ${complaint.issueSummary}
  Status      : In Progress
  Assigned To : ${complaint.assignedTo || 'Support Team'}

Our technical team has begun investigating your reported issue.

We will notify you as soon as the issue has been resolved.

Thank you for your patience.

Warm regards,
Digital Support Team
College IT Helpdesk`
  }),

  resolved: (complaint) => ({
    subject: `[${complaint.ticketId}] Resolved: ${complaint.issueCategory}`,
    body: `Dear ${complaint.studentName},

We are pleased to inform you that your reported issue has been resolved.

  Ticket ID   : ${complaint.ticketId}
  Issue       : ${complaint.issueSummary}
  Status      : ✅ Resolved
  Resolved On : ${new Date(complaint.resolvedAt || Date.now()).toLocaleString()}

Resolution Notes:
${complaint.resolutionNotes || 'Your issue has been resolved by our technical team.'}

If the issue persists, please reply within 48 hours and we will reopen your ticket.

Warm regards,
Digital Support Team
College IT Helpdesk`
  }),

  followUp: (complaint) => ({
    subject: `[${complaint.ticketId}] Follow-Up: ${complaint.issueCategory}`,
    body: `Dear ${complaint.studentName},

This is a follow-up regarding your support ticket.

  Ticket ID  : ${complaint.ticketId}
  Issue      : ${complaint.issueSummary}
  Days Open  : ${Math.floor((Date.now() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24))}

Your ticket is still being actively worked on.
We are escalating this to senior technical staff.

Expected Resolution: Within 24 hours

For urgent concerns:
  📧 priority@college.edu
  📞 +91-XXXXXXXXXX

We appreciate your patience.

Warm regards,
Digital Support Team
College IT Helpdesk`
  })
};

// GET email template preview
router.get('/template/:type/:ticketId', async (req, res) => {
  try {
    const { type, ticketId } = req.params;

    if (!emailTemplates[type]) {
      return res.status(400).json({ success: false, message: 'Invalid template type' });
    }

    const complaint = await Complaint.findOne({ ticketId });
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const template = emailTemplates[type](complaint);
    res.json({ success: true, data: template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all template types
router.get('/templates', (req, res) => {
  res.json({
    success: true,
    data: [
      { type: 'acknowledgment', label: 'Acknowledgment Email', description: 'Sent when complaint is first received' },
      { type: 'inProgress', label: 'In Progress Update', description: 'Sent when work begins on the issue' },
      { type: 'resolved', label: 'Resolution Email', description: 'Sent when issue is resolved' },
      { type: 'followUp', label: 'Follow-Up Email', description: 'Sent for long-pending tickets' }
    ]
  });
});

// POST mark email as sent
router.post('/mark-sent/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { emailSent: true },
      { new: true }
    );
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({ success: true, message: 'Marked as email sent', data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;